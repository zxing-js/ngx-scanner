import Binarizer from './../Binarizer';
import LuminanceSource from './../LuminanceSource';
import GlobalHistogramBinarizer from './GlobalHistogramBinarizer';
import BitMatrix from './BitMatrix';
/**
 * This class implements a local thresholding algorithm, which while slower than the
 * GlobalHistogramBinarizer, is fairly efficient for what it does. It is designed for
 * high frequency images of barcodes with black data on white backgrounds. For this application,
 * it does a much better job than a global blackpoint with severe shadows and gradients.
 * However it tends to produce artifacts on lower frequency images and is therefore not
 * a good general purpose binarizer for uses outside ZXing.
 *
 * This class extends GlobalHistogramBinarizer, using the older histogram approach for 1D readers,
 * and the newer local approach for 2D readers. 1D decoding using a per-row histogram is already
 * inherently local, and only fails for horizontal gradients. We can revisit that problem later,
 * but for now it was not a win to use local blocks for 1D.
 *
 * This Binarizer is the default for the unit tests and the recommended class for library users.
 *
 * @author dswitkin@google.com (Daniel Switkin)
 */
export default class HybridBinarizer extends GlobalHistogramBinarizer {
    private static BLOCK_SIZE_POWER;
    private static BLOCK_SIZE;
    private static BLOCK_SIZE_MASK;
    private static MINIMUM_DIMENSION;
    private static MIN_DYNAMIC_RANGE;
    private matrix;
    constructor(source: LuminanceSource);
    /**
     * Calculates the final BitMatrix once for all requests. This could be called once from the
     * constructor instead, but there are some advantages to doing it lazily, such as making
     * profiling easier, and not doing heavy lifting when callers don't expect it.
     */
    getBlackMatrix(): BitMatrix;
    createBinarizer(source: LuminanceSource): Binarizer;
    /**
     * For each block in the image, calculate the average black point using a 5x5 grid
     * of the blocks around it. Also handles the corner cases (fractional blocks are computed based
     * on the last pixels in the row/column which are also used in the previous block).
     */
    private static calculateThresholdForBlock(luminances, subWidth, subHeight, width, height, blackPoints, matrix);
    private static cap(value, min, max);
    /**
     * Applies a single threshold to a block of pixels.
     */
    private static thresholdBlock(luminances, xoffset, yoffset, threshold, stride, matrix);
    /**
     * Calculates a single black point for each block of pixels and saves it away.
     * See the following thread for a discussion of this algorithm:
     *  http://groups.google.com/group/zxing/browse_thread/thread/d06efa2c35a7ddc0
     */
    private static calculateBlackPoints(luminances, subWidth, subHeight, width, height);
}
