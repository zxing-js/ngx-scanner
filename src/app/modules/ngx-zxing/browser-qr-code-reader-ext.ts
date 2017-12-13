import Reader from 'zxing-typescript/src/core/Reader';
import BinaryBitmap from 'zxing-typescript/src/core/BinaryBitmap';
import HybridBinarizer from 'zxing-typescript/src/core/common/HybridBinarizer';
import Result from 'zxing-typescript/src/core/Result';
import Exception from 'zxing-typescript/src/core/Exception';
import QRCodeReader from 'zxing-typescript/src/core/qrcode/QRCodeReader';
import HTMLCanvasElementLuminanceSource from 'zxing-typescript/src/browser/HTMLCanvasElementLuminanceSource';

/**
 * Based on Zxing-typescript BrowserCodeReader
 */
export class BrowserCodeReaderExt {

    private videoElement: HTMLVideoElement;
    private imageElement: HTMLImageElement;
    private canvasElement: HTMLCanvasElement;
    private canvasElementContext: CanvasRenderingContext2D;
    private timeoutHandler: number;
    private stream: MediaStream;
    private videoPlayEndedEventListener: EventListener;
    private videoPlayingEventListener: EventListener;
    private imageLoadedEventListener: EventListener;

    public constructor(private reader: Reader, private timeBetweenScansMillis: number = 500) {
    }

    public decodeFromInputVideoDevice(callbackFn: (result: Result) => any, deviceId?: string, videoElement?: HTMLVideoElement): void {
        this.reset();

        this.prepareVideoElement(videoElement);

        let constraints: MediaStreamConstraints;
        if (undefined === deviceId) {
            constraints = {
                video: { facingMode: 'environment' }
            };
        } else {
            constraints = {
                video: { deviceId: { exact: deviceId } }
            };
        }

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream: MediaStream) => {
                this.stream = stream;
                this.videoElement.srcObject = stream;

                this.videoPlayingEventListener = () => {
                    this.decodeWithDelay(callbackFn);
                };
                this.videoElement.addEventListener('playing', this.videoPlayingEventListener);
                this.videoElement.play();
            });
    }


    private prepareVideoElement(videoElement?: HTMLVideoElement) {
        if (undefined === videoElement) {
            this.videoElement = document.createElement('video');
            this.videoElement.width = 200;
            this.videoElement.height = 200;
        } else {
            this.videoElement = videoElement;
        }
    }

    private decodeWithDelay(callbackFn: (result: Result) => any): void {
        this.timeoutHandler = window.setTimeout(this.decode.bind(this, callbackFn), this.timeBetweenScansMillis);
    }

    private decode(callbackFn: (result: Result) => any, retryIfNotFound: boolean = true, retryIfChecksumOrFormatError: boolean = true, once = false): void {
        if (undefined === this.canvasElementContext) {
            this.prepareCaptureCanvas();
        }

        this.canvasElementContext.drawImage(this.videoElement || this.imageElement, 0, 0);

        const luminanceSource = new HTMLCanvasElementLuminanceSource(this.canvasElement);
        const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

        try {
            const result = this.readerDecode(binaryBitmap);

            callbackFn(result);

            if (!once && undefined !== this.stream) {
                setTimeout(() => this.decodeWithDelay(callbackFn), this.timeBetweenScansMillis);
            }
        } catch (re) {
            console.debug(retryIfChecksumOrFormatError, re);

            if (retryIfNotFound && Exception.isOfType(re, Exception.NotFoundException)) {
                console.debug('not found, trying again...');
                this.decodeWithDelay(callbackFn);
            } else if (retryIfChecksumOrFormatError && (Exception.isOfType(re, Exception.ChecksumException) || Exception.isOfType(re, Exception.FormatException))) {
                console.debug('checksum or format error, trying again...', re);
                this.decodeWithDelay(callbackFn);
            }
        }
    }

    protected readerDecode(binaryBitmap: BinaryBitmap): Result {
        return this.reader.decode(binaryBitmap);
    }

    private prepareCaptureCanvas() {
        const canvasElement = document.createElement('canvas');
        let width, height;
        if (undefined !== this.videoElement) {
            width = this.videoElement.videoWidth;
            height = this.videoElement.videoHeight;
        } else {
            width = this.imageElement.naturalWidth || this.imageElement.width;
            height = this.imageElement.naturalHeight || this.imageElement.height;
        }
        canvasElement.style.width = `${width}px`;
        canvasElement.style.height = `${height}px`;
        canvasElement.width = width;
        canvasElement.height = height;

        this.canvasElement = canvasElement;
        this.canvasElementContext = canvasElement.getContext('2d');
    }

    private stop() {
        if (undefined !== this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
        if (undefined !== this.stream) {
            this.stream.getTracks()[0].stop();
            this.stream = null;
        }
    }

    public reset() {
        this.stop();

        if (undefined !== this.videoPlayEndedEventListener && undefined !== this.videoElement) {
            this.videoElement.removeEventListener('ended', this.videoPlayEndedEventListener);
        }
        if (undefined !== this.videoPlayingEventListener && undefined !== this.videoElement) {
            this.videoElement.removeEventListener('playing', this.videoPlayingEventListener);
        }
        if (undefined !== this.videoElement) {
            this.videoElement.srcObject = undefined;
            this.videoElement.removeAttribute('src');
            this.videoElement = undefined;
        }
        if (undefined !== this.videoPlayEndedEventListener && undefined !== this.imageElement) {
            this.imageElement.removeEventListener('load', this.imageLoadedEventListener);
        }
        if (undefined !== this.imageElement) {
            this.imageElement.src = undefined;
            this.imageElement.removeAttribute('src');
            this.imageElement = undefined;
        }
        this.canvasElementContext = undefined;
        this.canvasElement = undefined;
    }
}

export class BrowserQRCodeReaderExt extends BrowserCodeReaderExt {
    public constructor(timeBetweenScansMillis: number = 500) {
        super(new QRCodeReader(), timeBetweenScansMillis);
    }
}
