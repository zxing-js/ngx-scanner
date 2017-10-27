import ResultPointCallback from './../../ResultPointCallback';
import BitMatrix from './../../common/BitMatrix';
import AlignmentPattern from './AlignmentPattern';
/**
 * <p>This class attempts to find alignment patterns in a QR Code. Alignment patterns look like finder
 * patterns but are smaller and appear at regular intervals throughout the image.</p>
 *
 * <p>At the moment this only looks for the bottom-right alignment pattern.</p>
 *
 * <p>This is mostly a simplified copy of {@link FinderPatternFinder}. It is copied,
 * pasted and stripped down here for maximum performance but does unfortunately duplicate
 * some code.</p>
 *
 * <p>This class is thread-safe but not reentrant. Each thread must allocate its own object.</p>
 *
 * @author Sean Owen
 */
export default class AlignmentPatternFinder {
    private image;
    private startX;
    private startY;
    private width;
    private height;
    private moduleSize;
    private resultPointCallback;
    private possibleCenters;
    private crossCheckStateCount;
    /**
     * <p>Creates a finder that will look in a portion of the whole image.</p>
     *
     * @param image image to search
     * @param startX left column from which to start searching
     * @param startY top row from which to start searching
     * @param width width of region to search
     * @param height height of region to search
     * @param moduleSize estimated module size so far
     */
    constructor(image: BitMatrix, startX: number, startY: number, width: number, height: number, moduleSize: number, resultPointCallback: ResultPointCallback);
    /**
     * <p>This method attempts to find the bottom-right alignment pattern in the image. It is a bit messy since
     * it's pretty performance-critical and so is written to be fast foremost.</p>
     *
     * @return {@link AlignmentPattern} if found
     * @throws NotFoundException if not found
     */
    find(): AlignmentPattern;
    /**
     * Given a count of black/white/black pixels just seen and an end position,
     * figures the location of the center of this black/white/black run.
     */
    private static centerFromEnd(stateCount, end);
    /**
     * @param stateCount count of black/white/black pixels just read
     * @return true iff the proportions of the counts is close enough to the 1/1/1 ratios
     *         used by alignment patterns to be considered a match
     */
    private foundPatternCross(stateCount);
    /**
     * <p>After a horizontal scan finds a potential alignment pattern, this method
     * "cross-checks" by scanning down vertically through the center of the possible
     * alignment pattern to see if the same proportion is detected.</p>
     *
     * @param startI row where an alignment pattern was detected
     * @param centerJ center of the section that appears to cross an alignment pattern
     * @param maxCount maximum reasonable number of modules that should be
     * observed in any reading state, based on the results of the horizontal scan
     * @return vertical center of alignment pattern, or {@link Float#NaN} if not found
     */
    private crossCheckVertical(startI, centerJ, maxCount, originalStateCountTotal);
    /**
     * <p>This is called when a horizontal scan finds a possible alignment pattern. It will
     * cross check with a vertical scan, and if successful, will see if this pattern had been
     * found on a previous horizontal scan. If so, we consider it confirmed and conclude we have
     * found the alignment pattern.</p>
     *
     * @param stateCount reading state module counts from horizontal scan
     * @param i row where alignment pattern may be found
     * @param j end of possible alignment pattern in row
     * @return {@link AlignmentPattern} if we have found the same pattern twice, or null if not
     */
    private handlePossibleCenter(stateCount, i, j);
}
