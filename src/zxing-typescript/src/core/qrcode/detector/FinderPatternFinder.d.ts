import DecodeHintType from './../../DecodeHintType';
import ResultPointCallback from './../../ResultPointCallback';
import BitMatrix from './../../common/BitMatrix';
import FinderPattern from './FinderPattern';
import FinderPatternInfo from './FinderPatternInfo';
/**
 * <p>This class attempts to find finder patterns in a QR Code. Finder patterns are the square
 * markers at three corners of a QR Code.</p>
 *
 * <p>This class is thread-safe but not reentrant. Each thread must allocate its own object.
 *
 * @author Sean Owen
 */
export default class FinderPatternFinder {
    private image;
    private resultPointCallback;
    private static CENTER_QUORUM;
    protected static MIN_SKIP: number;
    protected static MAX_MODULES: number;
    private possibleCenters;
    private hasSkipped;
    private crossCheckStateCount;
    /**
     * <p>Creates a finder that will search the image for three finder patterns.</p>
     *
     * @param image image to search
     */
    constructor(image: BitMatrix, resultPointCallback: ResultPointCallback);
    protected getImage(): BitMatrix;
    protected getPossibleCenters(): FinderPattern[];
    find(hints: Map<DecodeHintType, any>): FinderPatternInfo;
    /**
     * Given a count of black/white/black/white/black pixels just seen and an end position,
     * figures the location of the center of this run.
     */
    private static centerFromEnd(stateCount, end);
    /**
     * @param stateCount count of black/white/black/white/black pixels just read
     * @return true iff the proportions of the counts is close enough to the 1/1/3/1/1 ratios
     *         used by finder patterns to be considered a match
     */
    protected static foundPatternCross(stateCount: Int32Array): boolean;
    private getCrossCheckStateCount();
    /**
     * After a vertical and horizontal scan finds a potential finder pattern, this method
     * "cross-cross-cross-checks" by scanning down diagonally through the center of the possible
     * finder pattern to see if the same proportion is detected.
     *
     * @param startI row where a finder pattern was detected
     * @param centerJ center of the section that appears to cross a finder pattern
     * @param maxCount maximum reasonable number of modules that should be
     *  observed in any reading state, based on the results of the horizontal scan
     * @param originalStateCountTotal The original state count total.
     * @return true if proportions are withing expected limits
     */
    private crossCheckDiagonal(startI, centerJ, maxCount, originalStateCountTotal);
    /**
     * <p>After a horizontal scan finds a potential finder pattern, this method
     * "cross-checks" by scanning down vertically through the center of the possible
     * finder pattern to see if the same proportion is detected.</p>
     *
     * @param startI row where a finder pattern was detected
     * @param centerJ center of the section that appears to cross a finder pattern
     * @param maxCount maximum reasonable number of modules that should be
     * observed in any reading state, based on the results of the horizontal scan
     * @return vertical center of finder pattern, or {@link Float#NaN} if not found
     */
    private crossCheckVertical(startI, centerJ, maxCount, originalStateCountTotal);
    /**
     * <p>Like {@link #crossCheckVertical(int, int, int, int)}, and in fact is basically identical,
     * except it reads horizontally instead of vertically. This is used to cross-cross
     * check a vertical cross check and locate the real center of the alignment pattern.</p>
     */
    private crossCheckHorizontal(startJ, centerI, maxCount, originalStateCountTotal);
    /**
     * <p>This is called when a horizontal scan finds a possible alignment pattern. It will
     * cross check with a vertical scan, and if successful, will, ah, cross-cross-check
     * with another horizontal scan. This is needed primarily to locate the real horizontal
     * center of the pattern in cases of extreme skew.
     * And then we cross-cross-cross check with another diagonal scan.</p>
     *
     * <p>If that succeeds the finder pattern location is added to a list that tracks
     * the number of times each location has been nearly-matched as a finder pattern.
     * Each additional find is more evidence that the location is in fact a finder
     * pattern center
     *
     * @param stateCount reading state module counts from horizontal scan
     * @param i row where finder pattern may be found
     * @param j end of possible finder pattern in row
     * @param pureBarcode true if in "pure barcode" mode
     * @return true if a finder pattern candidate was found this time
     */
    protected handlePossibleCenter(stateCount: Int32Array, i: number, j: number, pureBarcode: boolean): boolean;
    /**
     * @return number of rows we could safely skip during scanning, based on the first
     *         two finder patterns that have been located. In some cases their position will
     *         allow us to infer that the third pattern must lie below a certain point farther
     *         down in the image.
     */
    private findRowSkip();
    /**
     * @return true iff we have found at least 3 finder patterns that have been detected
     *         at least {@link #CENTER_QUORUM} times each, and, the estimated module size of the
     *         candidates is "pretty similar"
     */
    private haveMultiplyConfirmedCenters();
    /**
     * @return the 3 best {@link FinderPattern}s from our list of candidates. The "best" are
     *         those that have been detected at least {@link #CENTER_QUORUM} times, and whose module
     *         size differs from the average among those patterns the least
     * @throws NotFoundException if 3 such finder patterns do not exist
     */
    private selectBestPatterns();
}
