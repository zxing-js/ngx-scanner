import DecodeHintType from './../../DecodeHintType';
import ResultPoint from './../../ResultPoint';
import ResultPointCallback from './../../ResultPointCallback';
import BitMatrix from './../../common/BitMatrix';
import DetectorResult from './../../common/DetectorResult';
import FinderPatternInfo from './FinderPatternInfo';
import AlignmentPattern from './AlignmentPattern';
/**
 * <p>Encapsulates logic that can detect a QR Code in an image, even if the QR Code
 * is rotated or skewed, or partially obscured.</p>
 *
 * @author Sean Owen
 */
export default class Detector {
    private image;
    private resultPointCallback;
    constructor(image: BitMatrix);
    protected getImage(): BitMatrix;
    protected getResultPointCallback(): ResultPointCallback;
    /**
     * <p>Detects a QR Code in an image.</p>
     *
     * @return {@link DetectorResult} encapsulating results of detecting a QR Code
     * @throws NotFoundException if QR Code cannot be found
     * @throws FormatException if a QR Code cannot be decoded
     */
    /**
     * <p>Detects a QR Code in an image.</p>
     *
     * @param hints optional hints to detector
     * @return {@link DetectorResult} encapsulating results of detecting a QR Code
     * @throws NotFoundException if QR Code cannot be found
     * @throws FormatException if a QR Code cannot be decoded
     */
    detect(hints: Map<DecodeHintType, any>): DetectorResult;
    protected processFinderPatternInfo(info: FinderPatternInfo): DetectorResult;
    private static createTransform(topLeft, topRight, bottomLeft, alignmentPattern, dimension);
    private static sampleGrid(image, transform, dimension);
    /**
     * <p>Computes the dimension (number of modules on a size) of the QR Code based on the position
     * of the finder patterns and estimated module size.</p>
     */
    private static computeDimension(topLeft, topRight, bottomLeft, moduleSize);
    /**
     * <p>Computes an average estimated module size based on estimated derived from the positions
     * of the three finder patterns.</p>
     *
     * @param topLeft detected top-left finder pattern center
     * @param topRight detected top-right finder pattern center
     * @param bottomLeft detected bottom-left finder pattern center
     * @return estimated module size
     */
    protected calculateModuleSize(topLeft: ResultPoint, topRight: ResultPoint, bottomLeft: ResultPoint): number;
    /**
     * <p>Estimates module size based on two finder patterns -- it uses
     * {@link #sizeOfBlackWhiteBlackRunBothWays(int, int, int, int)} to figure the
     * width of each, measuring along the axis between their centers.</p>
     */
    private calculateModuleSizeOneWay(pattern, otherPattern);
    /**
     * See {@link #sizeOfBlackWhiteBlackRun(int, int, int, int)}; computes the total width of
     * a finder pattern by looking for a black-white-black run from the center in the direction
     * of another point (another finder pattern center), and in the opposite direction too.
     */
    private sizeOfBlackWhiteBlackRunBothWays(fromX, fromY, toX, toY);
    /**
     * <p>This method traces a line from a point in the image, in the direction towards another point.
     * It begins in a black region, and keeps going until it finds white, then black, then white again.
     * It reports the distance from the start to this point.</p>
     *
     * <p>This is used when figuring out how wide a finder pattern is, when the finder pattern
     * may be skewed or rotated.</p>
     */
    private sizeOfBlackWhiteBlackRun(fromX, fromY, toX, toY);
    /**
     * <p>Attempts to locate an alignment pattern in a limited region of the image, which is
     * guessed to contain it. This method uses {@link AlignmentPattern}.</p>
     *
     * @param overallEstModuleSize estimated module size so far
     * @param estAlignmentX x coordinate of center of area probably containing alignment pattern
     * @param estAlignmentY y coordinate of above
     * @param allowanceFactor number of pixels in all directions to search from the center
     * @return {@link AlignmentPattern} if found, or null otherwise
     * @throws NotFoundException if an unexpected error occurs during detection
     */
    protected findAlignmentInRegion(overallEstModuleSize: number, estAlignmentX: number, estAlignmentY: number, allowanceFactor: number): AlignmentPattern;
}
