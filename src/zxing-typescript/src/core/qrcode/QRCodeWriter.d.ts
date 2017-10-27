import BarcodeFormat from './../BarcodeFormat';
import EncodeHintType from './../EncodeHintType';
import Writer from './../Writer';
import BitMatrix from './../common/BitMatrix';
/**
 * This object renders a QR Code as a BitMatrix 2D array of greyscale values.
 *
 * @author dswitkin@google.com (Daniel Switkin)
 */
export default class QRCodeWriter implements Writer {
    private static QUIET_ZONE_SIZE;
    encode(contents: string, format: BarcodeFormat, width: number, height: number, hints: Map<EncodeHintType, any>): BitMatrix;
    private static renderResult(code, width, height, quietZone);
}
