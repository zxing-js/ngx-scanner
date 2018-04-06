import {
    Reader,
    BinaryBitmap,
    HybridBinarizer,
    Result,
    Exception,
    HTMLCanvasElementLuminanceSource,
} from '@zxing/library';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/**
 * Based on zxing-typescript BrowserCodeReader
 */
export class BrowserCodeReader {

    /**
     * The HTML video element, used to display the camera stream.
     */
    private videoElement: HTMLVideoElement;
    /**
     * Should contain the actual registered listener for video play-ended,
     * used to unregister that listener when needed.
     */
    private videoPlayEndedEventListener: EventListener;
    /**
     * Should contain the actual registered listener for video playing,
     * used to unregister that listener when needed.
     */
    private videoPlayingEventListener: EventListener;
    /**
     * Should contain the actual registered listener for video loaded-metadata,
     * used to unregister that listener when needed.
     */
    private videoLoadedMetadataEventListener: EventListener;

    /**
     * The HTML image element, used as a fallback for the video element when decoding.
     */
    private imageElement: HTMLImageElement;
    /**
     * Should contain the actual registered listener for image loading,
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
     * The continuous scan timeout Id.
     */
    private timeoutHandler: number;

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
     * Constructor for dependency injection.
     *
     * @param reader The barcode reader to be used to decode the stream.
     * @param timeBetweenScans The scan throttling in milliseconds.
     */
    public constructor(private reader: Reader, private timeBetweenScans: number = 500) { }

    /**
     * Starts the decoding from the actual or a new video element.
     *
     * @param callbackFn The callback to be executed after every scan attempt
     * @param deviceId The device's to be used Id
     * @param videoElement A new video element
     */
    public decodeFromInputVideoDevice(callbackFn: (result: Result) => any, deviceId?: string, videoElement?: HTMLVideoElement): void {

        this.reset();

        this.prepareVideoElement(videoElement);

        const video = deviceId === undefined
            ? { facingMode: { exact: 'environment' } }
            : { deviceId: { exact: deviceId } };

        const constraints: MediaStreamConstraints = {
            audio: false,
            video
        };

        if (!navigator) {
            return;
        }

        navigator
            .mediaDevices
            .getUserMedia(constraints)
            .then((stream: MediaStream) => this.startDecodeFromStream(stream, callbackFn))
            .catch((err: any) => {
                /* handle the error, or not */
                console.error(err);
            });
    }

    /**
     * Sets the new stream and request a new decoding-with-delay.
     *
     * @param stream The stream to be shown in the video element.
     * @param callbackFn A callback for the decode method.
     */
    private startDecodeFromStream(stream: MediaStream, callbackFn: (result: Result) => any): void {
        this.stream = stream;
        this.bindSrc(this.videoElement, this.stream);
        this.bindEvents(this.videoElement, callbackFn);
        this.checkTorchCompatibility(this.stream);
    }

    private bindSrc(videoElement: HTMLVideoElement, stream: MediaStream): void {
        // Older browsers may not have srcObject
        if ('srcObject' in videoElement) {
            // @NOTE Throws Exception if interrupted by a new loaded request
            videoElement.srcObject = stream;
        } else {
            // @NOTE Avoid using this in new browsers, as it is going away.
            (<HTMLVideoElement>videoElement).src = window.URL.createObjectURL(stream);
        }
    }

    private bindEvents(videoElement: HTMLVideoElement, callbackFn: (result: Result) => any): void {
        this.videoPlayingEventListener = () => {
            this.decodeWithDelay(callbackFn);
        };

        videoElement.addEventListener('playing', this.videoPlayingEventListener);

        this.videoLoadedMetadataEventListener = () => {
            videoElement.play();
        };

        videoElement.addEventListener('loadedmetadata', this.videoLoadedMetadataEventListener);
    }

    private checkTorchCompatibility(stream: MediaStream): boolean {
        let compatible = false;
        this.track = stream.getVideoTracks()[0];

        const imageCapture = new ImageCapture(this.track);
        const photoCapabilities = imageCapture.getPhotoCapabilities().then((capabilities) => {
            compatible = (!!capabilities.torch) ||
                ('fillLightMode' in capabilities && capabilities.fillLightMode.length !== 0);
            this.torchCompatible.next(compatible);
        });
        return compatible;
    }

    public setTorch(on: boolean) {
        if (this.torchCompatible.value) {
            this.track.applyConstraints({
                advanced: [<any>{ torch: on }]
            });
        }
    }

    public get torchAvailable(): Observable<boolean> {
        return this.torchCompatible.asObservable();
    }

    /**
     * Sets a HTMLVideoElement for scanning or creates a new one.
     *
     * @param videoElement The HTMLVideoElement to be set.
     */
    private prepareVideoElement(videoElement?: HTMLVideoElement) {
        if (!videoElement) {
            this.videoElement = document.createElement('video');
            this.videoElement.width = 200;
            this.videoElement.height = 200;
        } else {
            this.videoElement = videoElement;
        }
    }

    /**
     *
     * @param callbackFn
     */
    private decodeWithDelay(callbackFn: (result: Result) => any): void {
        this.timeoutHandler = window.setTimeout(this.decode.bind(this, callbackFn), this.timeBetweenScans);
    }

    /**
     * Does the real image decoding job.
     *
     * @param callbackFn
     * @param retryIfNotFound
     * @param retryIfChecksumOrFormatError
     * @param once
     */
    private decode(
        callbackFn: (result: Result) => any,
        retryIfNotFound: boolean = true,
        retryIfChecksumOrFormatError: boolean = true,
        once = false
    ): void {

        if (undefined === this.canvasElementContext) {
            this.prepareCaptureCanvas();
        }

        this.canvasElementContext.drawImage(this.videoElement || this.imageElement, 0, 0);

        const luminanceSource = new HTMLCanvasElementLuminanceSource(this.canvasElement);
        const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

        try {

            const result = this.readerDecode(binaryBitmap);

            callbackFn(result);

            if (!once && !!this.stream) {
                setTimeout(() => this.decodeWithDelay(callbackFn), this.timeBetweenScans);
            }

        } catch (re) {

            console.debug(retryIfChecksumOrFormatError, re);

            if (retryIfNotFound && Exception.isOfType(re, Exception.NotFoundException)) {

                console.debug('zxing-scanner', 'QR-code not-found, trying again...');

                this.decodeWithDelay(callbackFn);

            } else if (
                retryIfChecksumOrFormatError &&
                (
                    Exception.isOfType(re, Exception.ChecksumException) ||
                    Exception.isOfType(re, Exception.FormatException)
                )
            ) {
                console.warn('zxing-scanner', 'Checksum or format error, trying again...', re);

                this.decodeWithDelay(callbackFn);
            }
        }
    }

    /**
     * Alias for this.reader.decode
     *
     * @param binaryBitmap
     */
    protected readerDecode(binaryBitmap: BinaryBitmap): Result {
        return this.reader.decode(binaryBitmap);
    }

    /**
     * 🖌 Prepares the canvas for capture and scan frames.
     */
    private prepareCaptureCanvas() {

        const canvasElement = document.createElement('canvas');

        let width: number;
        let height: number;

        if (undefined !== this.videoElement) {
            width = this.videoElement.videoWidth;
            height = this.videoElement.videoHeight;
        } else {
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

        if (this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }

        if (this.stream) {
            this.stream.getTracks()[0].stop();
            this.stream = null;
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

            if (undefined !== this.videoPlayEndedEventListener) {
                this.videoElement.removeEventListener('ended', this.videoPlayEndedEventListener);
            }

            if (undefined !== this.videoPlayingEventListener) {
                this.videoElement.removeEventListener('playing', this.videoPlayingEventListener);
            }

            if (undefined !== this.videoLoadedMetadataEventListener) {
                this.videoElement.removeEventListener('loadedmetadata', this.videoLoadedMetadataEventListener);
            }

            // then forgets about that element 😢

            this.videoElement.srcObject = undefined;
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
}
