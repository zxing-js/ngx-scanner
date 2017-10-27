import ResultPoint from './../ResultPoint';
import BitMatrix from './BitMatrix';
/**
 * <p>Encapsulates the result of detecting a barcode in an image. This includes the raw
 * matrix of black/white pixels corresponding to the barcode, and possibly points of interest
 * in the image, like the location of finder patterns or corners of the barcode in the image.</p>
 *
 * @author Sean Owen
 */
export default class DetectorResult {
    private bits;
    private points;
    constructor(bits: BitMatrix, points: Array<ResultPoint>);
    getBits(): BitMatrix;
    getPoints(): Array<ResultPoint>;
}
