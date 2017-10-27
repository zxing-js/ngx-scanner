import BitMatrix from './common/BitMatrix';
import Writer from './Writer';
import BarcodeFormat from './BarcodeFormat';
import EncodeHintType from './EncodeHintType';
/**
 * This is a factory class which finds the appropriate Writer subclass for the BarcodeFormat
 * requested and encodes the barcode with the supplied contents.
 *
 * @author dswitkin@google.com (Daniel Switkin)
 */
export default class MultiFormatWriter implements Writer {
    encode(contents: string, format: BarcodeFormat, width: number, height: number, hints: Map<EncodeHintType, any>): BitMatrix;
}
