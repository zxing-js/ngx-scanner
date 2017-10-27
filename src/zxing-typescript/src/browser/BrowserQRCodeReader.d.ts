import VideoInputDevice from './VideoInputDevice';
import BrowserCodeReader from './BrowserCodeReader';
/**
 * QR Code reader to use from browser.
 *
 * @class BrowserQRCodeReader
 * @extends {BrowserCodeReader}
 */
declare class BrowserQRCodeReader extends BrowserCodeReader {
    /**
     * Creates an instance of BrowserQRCodeReader.
     * @param {number} [timeBetweenScansMillis=500] the time delay between subsequent decode tries
     *
     * @memberOf BrowserQRCodeReader
     */
    constructor(timeBetweenScansMillis?: number);
}
export { VideoInputDevice, BrowserQRCodeReader };
