import Reader from "./../core/Reader";
import BinaryBitmap from './../core/BinaryBitmap';
import Result from './../core/Result';
import VideoInputDevice from './VideoInputDevice';
/**
 * Base class for browser code reader.
 *
 * @export
 * @class BrowserCodeReader
 */
export default class BrowserCodeReader {
    private reader;
    private timeBetweenScansMillis;
    private videoElement;
    private imageElement;
    private canvasElement;
    private canvasElementContext;
    private timeoutHandler;
    private stream;
    private videoPlayEndedEventListener;
    private videoPlayingEventListener;
    private imageLoadedEventListener;
    /**
     * Creates an instance of BrowserCodeReader.
     * @param {Reader} reader The reader instance to decode the barcode
     * @param {number} [timeBetweenScansMillis=500] the time delay between subsequent decode tries
     *
     * @memberOf BrowserCodeReader
     */
    constructor(reader: Reader, timeBetweenScansMillis?: number);
    /**
     * Obtain the list of available devices with type 'videoinput'.
     *
     * @returns {Promise<VideoInputDevice[]>} an array of available video input devices
     *
     * @memberOf BrowserCodeReader
     */
    getVideoInputDevices(): Promise<VideoInputDevice[]>;
    /**
     * Decodes the barcode from the device specified by deviceId while showing the video in the specified video element.
     *
     * @param {string} [deviceId] the id of one of the devices obtained after calling getVideoInputDevices. Can be undefined, in this case it will decode from one of the available devices, preffering the main camera (environment facing) if available.
     * @param {(string|HTMLVideoElement)} [videoElement] the video element in page where to show the video while decoding. Can be either an element id or directly an HTMLVideoElement. Can be undefined, in which case no video will be shown.
     * @returns {Promise<Result>} The decoding result.
     *
     * @memberOf BrowserCodeReader
     */
    decodeFromInputVideoDevice(deviceId?: string, videoElement?: string | HTMLVideoElement): Promise<Result>;
    /**
     * Decodes a barcode form a video url.
     *
     * @param {string} videoUrl The video url to decode from, required.
     * @param {(string|HTMLVideoElement)} [videoElement] The video element where to play the video while decoding. Can be undefined in which case no video is shown.
     * @returns {Promise<Result>} The decoding result.
     *
     * @memberOf BrowserCodeReader
     */
    decodeFromVideoSource(videoUrl: string, videoElement?: string | HTMLVideoElement): Promise<Result>;
    private prepareVideoElement(videoElement?);
    private getMediaElement(mediaElementId, type);
    /**
     * Decodes the barcode from an image.
     *
     * @param {(string|HTMLImageElement)} [imageElement] The image element that can be either an element id or the element itself. Can be undefined in which case the decoding will be done from the imageUrl parameter.
     * @param {string} [imageUrl]
     * @returns {Promise<Result>} The decoding result.
     *
     * @memberOf BrowserCodeReader
     */
    decodeFromImage(imageElement?: string | HTMLImageElement, imageUrl?: string): Promise<Result>;
    private isImageLoaded(img);
    private prepareImageElement(imageElement?);
    private decodeOnceWithDelay(resolve, reject);
    private decodeOnce(resolve, reject, retryIfNotFound?, retryIfChecksumOrFormatError?);
    protected readerDecode(binaryBitmap: BinaryBitmap): Result;
    private prepareCaptureCanvas();
    private stop();
    /**
     * Resets the code reader to the initial state. Cancels any ongoing barcode scanning from video or camera.
     *
     * @memberOf BrowserCodeReader
     */
    reset(): void;
}
