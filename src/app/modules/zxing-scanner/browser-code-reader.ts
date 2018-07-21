/// <reference path="./image-capture.d.ts" />

import {
    BinaryBitmap,
    ChecksumException,
    Exception,
    FormatException,
    HTMLCanvasElementLuminanceSource,
    HybridBinarizer,
    NotFoundException,
    Reader,
    Result,
} from '@zxing/library';

import {
    BehaviorSubject,
    Observable,
    Subscriber,
    Subscription
} from 'rxjs';

import { catchError } from 'rxjs/operators';

/**
 * Based on zxing-typescript BrowserCodeReader
 */
export class BrowserCodeReader {

    /**
     * The HTML video element, used to display the camera stream.
     */
    private videoElement: HTMLVideoElement;
    /**
     * Should contain the current registered listener for video play-ended,
     * used to unregister that listener when needed.
     */
    private videoPlayEndedEventListener: EventListener;
    /**
     * Should contain the current registered listener for video playing,
     * used to unregister that listener when needed.
     */
    private videoPlayingEventListener: EventListener;
    /**
     * Should contain the current registered listener for video loaded-metadata,
     * used to unregister that listener when needed.
     */
    private videoLoadedMetadataEventListener: EventListener;

    /**
     * The HTML image element, used as a fallback for the video element when decoding.
     */
    private imageElement: HTMLImageElement;
    /**
     * Should contain the current registered listener for image loading,
     * used to unregister that listener when needed.
     */
    private imageLoadedEventListener: EventListener;

    /**
     * The HTML canvas element, used to draw the video or image's frame for decoding.
     */
    private canvasElement: HTMLCanvasElement;
    /**
     * The HTML canvas element context.
     */
    private canvasElementContext: CanvasRenderingContext2D;

    /**
     * Used to control the decoding stream when it's open.
     */
    private decodingStream: Subscription;

    /**
     * The stream output from camera.
     */
    private stream: MediaStream;
    /**
     * The track from camera.
     */
    private track: MediaStreamTrack;
    /**
     * Shows if torch is available on the camera.
     */
    private torchCompatible = new BehaviorSubject<boolean>(false);

    /**
     * The device id of the current media device.
     */
    private deviceId: string;

    /**
     * Constructor for dependency injection.
     *
     * @param reader The barcode reader to be used to decode the stream.
     * @param timeBetweenScans The scan throttling in milliseconds.
     */
    public constructor(protected readonly reader: Reader, private timeBetweenScans: number = 500) { }

    /**
     * Starts the decoding from the current or a new video element.
     *
     * @param callbackFn The callback to be executed after every scan attempt
     * @param deviceId The device's to be used Id
     * @param videoElement A new video element
     *
     * @todo Return Promise<Result>
     */
    public async decodeFromInputVideoDevice(
        callbackFn?: (result: Result) => any,
        deviceId?: string,
        videoElement?: HTMLVideoElement
    ): Promise<void> {

        this.reset();

        this.prepareVideoElement(videoElement);

        // Keeps the deviceId between scanner resets.
        if (typeof deviceId !== 'undefined') {
            this.deviceId = deviceId;
        }

        const video = typeof deviceId === 'undefined'
            ? { facingMode: { exact: 'environment' } }
            : { deviceId: { exact: deviceId } };

        const constraints: MediaStreamConstraints = {
            audio: false,
            video
        };

        if (typeof navigator === 'undefined') {
            return;
        }

        try {
            const stream = await navigator
                .mediaDevices
                .getUserMedia(constraints);

            this.startDecodeFromStream(stream, callbackFn);

        } catch (err) {
            /* handle the error, or not */
            console.error(err);
        }
    }

    /**
     * Sets the new stream and request a new decoding-with-delay.
     *
     * @param stream The stream to be shown in the video element.
     * @param callbackFn A callback for the decode method.
     *
     * @todo Return Promise<Result>
     */
    private startDecodeFromStream(stream: MediaStream, callbackFn?: (result: Result) => any): void {
        this.stream = stream;
        this.checkTorchCompatibility(this.stream);
        this.bindVideoSrc(this.videoElement, this.stream);
        this.bindEvents(this.videoElement, callbackFn);
    }

    /**
     * Defines what the videoElement src will be.
     *
     * @param videoElement
     * @param stream
     */
    public bindVideoSrc(videoElement: HTMLVideoElement, stream: MediaStream): void {
        // Older browsers may not have `srcObject`
        try {
            // @NOTE Throws Exception if interrupted by a new loaded request
            videoElement.srcObject = stream;
        } catch (err) {
            // @NOTE Avoid using this in new browsers, as it is going away.
            videoElement.src = window.URL.createObjectURL(stream);
        }
    }

    /**
     * Unbinds a HTML video src property.
     *
     * @param videoElement
     */
    public unbindVideoSrc(videoElement: HTMLVideoElement): void {
        try {
            videoElement.srcObject = null;
        } catch (err) {
            videoElement.src = '';
        }
    }

    /**
     * Binds listeners and callbacks to the videoElement.
     *
     * @param videoElement
     * @param callbackFn
     */
    private bindEvents(videoElement: HTMLVideoElement, callbackFn?: (result: Result) => any): void {

        if (typeof callbackFn !== 'undefined') {
            this.videoPlayingEventListener = () => this.decodingStream = this.decodeWithDelay(this.timeBetweenScans)
                .pipe(catchError((e, x) => this.handleDecodeStreamError(e, x)))
                .subscribe((x: Result) => callbackFn(x));
        }

        videoElement.addEventListener('playing', this.videoPlayingEventListener);

        this.videoLoadedMetadataEventListener = () => videoElement.play();

        videoElement.addEventListener('loadedmetadata', this.videoLoadedMetadataEventListener);
    }

    /**
     * Checks if the stream supports torch control.
     *
     * @param stream The media stream used to check.
     */
    private async checkTorchCompatibility(stream: MediaStream): Promise<void> {
        try {
            this.track = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(this.track);
            const capabilities = await imageCapture.getPhotoCapabilities();
            const compatible = !!capabilities.torch || ('fillLightMode' in capabilities && capabilities.fillLightMode.length !== 0);
            this.torchCompatible.next(compatible);
        } catch (err) {
            this.torchCompatible.next(false);
        }
    }

    /**
     * Enables and disables the device torch.
     */
    public setTorch(on: boolean): void {
        if (!this.torchCompatible.value) {
            return;
        }
        if (on) {
            this.track.applyConstraints({
                advanced: [<any>{ torch: true }]
            });
        } else {
            this.restart();
        }
    }

    /**
     * Observable that says if there's a torch available for the current device.
     */
    public get torchAvailable(): Observable<boolean> {
        return this.torchCompatible.asObservable();
    }

    /**
     * Sets a HTMLVideoElement for scanning or creates a new one.
     *
     * @param videoElement The HTMLVideoElement to be set.
     */
    private prepareVideoElement(videoElement?: HTMLVideoElement): void {

        if (!videoElement && typeof document !== 'undefined') {
            videoElement = document.createElement('video');
            videoElement.width = 200;
            videoElement.height = 200;
        }

        this.videoElement = videoElement;
    }

    /**
     * Opens a decoding stream.
     */
    private decodeWithDelay(delay: number = 500): Observable<Result> {
        // The decoding stream.
        return Observable.create((observer: Subscriber<Result>) => {
            // Creates on Subscribe.
            const intervalId = setInterval(() => {
                try {
                    observer.next(this.decode());
                } catch (err) {
                    observer.error(err);
                }
            }, delay);
            // Destroys on Unsubscribe.
            return () => clearInterval(intervalId);
        });
    }

    /**
     * Gets the BinaryBitmap for ya! (and decodes it)
     */
    private decode(): Result {

        // get binary bitmap for decode function
        const binaryBitmap = this.createBinaryBitmap(this.videoElement || this.imageElement);

        return this.decodeBitmap(binaryBitmap);
    }

    /**
     * Call the encapsulated readers decode
     */
    protected decodeBitmap(binaryBitmap: BinaryBitmap): Result {
        return this.reader.decode(binaryBitmap);
    }

    /**
     * Administra um erro gerado durante o decode stream.
     */
    private handleDecodeStreamError(err: Exception, caught: Observable<Result>): Observable<Result> {

        if (
            // scan Failure - found nothing, no error
            err instanceof NotFoundException ||
            // scan Error - found the QR but got error on decoding
            err instanceof ChecksumException ||
            err instanceof FormatException
        ) {
            return caught;
        }

        throw err;
    }

    /**
     * Creates a binaryBitmap based in some image source.
     *
     * @param mediaElement HTML element containing drawable image source.
     */
    private createBinaryBitmap(mediaElement: HTMLVideoElement | HTMLImageElement): BinaryBitmap {

        if (undefined === this.canvasElementContext) {
            this.prepareCaptureCanvas();
        }

        this.canvasElementContext.drawImage(mediaElement, 0, 0);

        const luminanceSource = new HTMLCanvasElementLuminanceSource(this.canvasElement);
        const hybridBinarizer = new HybridBinarizer(luminanceSource);

        return new BinaryBitmap(hybridBinarizer);
    }

    /**
     * 🖌 Prepares the canvas for capture and scan frames.
     */
    private prepareCaptureCanvas(): void {

        if (typeof document === 'undefined') {

            this.canvasElement = undefined;
            this.canvasElementContext = undefined;

            return;
        }

        const canvasElement = document.createElement('canvas');

        let width: number;
        let height: number;

        if (typeof this.videoElement !== 'undefined') {
            width = this.videoElement.videoWidth;
            height = this.videoElement.videoHeight;
        }

        if (typeof this.imageElement !== 'undefined') {
            width = this.imageElement.naturalWidth || this.imageElement.width;
            height = this.imageElement.naturalHeight || this.imageElement.height;
        }

        canvasElement.style.width = width + 'px';
        canvasElement.style.height = height + 'px';
        canvasElement.width = width;
        canvasElement.height = height;

        this.canvasElement = canvasElement;
        this.canvasElementContext = canvasElement.getContext('2d');
    }

    /**
     * Stops the continuous scan and cleans the stream.
     */
    private stop(): void {

        if (this.decodingStream) {
            this.decodingStream.unsubscribe();
        }

        if (this.stream) {
            this.stream.getVideoTracks().forEach(t => t.stop());
            this.stream = undefined;
        }

    }

    /**
     * Resets the scanner and it's configurations.
     */
    public reset(): void {

        // stops the camera, preview and scan 🔴

        this.stop();

        if (this.videoElement) {

            // first gives freedon to the element 🕊

            if (typeof this.videoPlayEndedEventListener !== 'undefined') {
                this.videoElement.removeEventListener('ended', this.videoPlayEndedEventListener);
            }

            if (typeof this.videoPlayingEventListener !== 'undefined') {
                this.videoElement.removeEventListener('playing', this.videoPlayingEventListener);
            }

            if (typeof this.videoLoadedMetadataEventListener !== 'undefined') {
                this.videoElement.removeEventListener('loadedmetadata', this.videoLoadedMetadataEventListener);
            }

            // then forgets about that element 😢

            this.unbindVideoSrc(this.videoElement);

            this.videoElement.removeAttribute('src');
            this.videoElement = undefined;
        }

        if (this.imageElement) {

            // first gives freedon to the element 🕊

            if (undefined !== this.videoPlayEndedEventListener) {
                this.imageElement.removeEventListener('load', this.imageLoadedEventListener);
            }

            // then forgets about that element 😢

            this.imageElement.src = undefined;
            this.imageElement.removeAttribute('src');
            this.imageElement = undefined;
        }

        // cleans canvas references 🖌

        this.canvasElementContext = undefined;
        this.canvasElement = undefined;
    }

    /**
     * Restarts the scanner.
     */
    private restart(): void {
        // reset
        // start
        this.decodeFromInputVideoDevice(undefined, this.deviceId, this.videoElement);
    }
}
