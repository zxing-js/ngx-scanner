import ResultPoint from './../../ResultPoint';
/**
 * <p>Encapsulates a finder pattern, which are the three square patterns found in
 * the corners of QR Codes. It also encapsulates a count of similar finder patterns,
 * as a convenience to the finder's bookkeeping.</p>
 *
 * @author Sean Owen
 */
export default class FinderPattern extends ResultPoint {
    private estimatedModuleSize;
    private count;
    constructor(posX: number, posY: number, estimatedModuleSize: number, count?: number);
    getEstimatedModuleSize(): number;
    getCount(): number;
    /**
     * <p>Determines if this finder pattern "about equals" a finder pattern at the stated
     * position and size -- meaning, it is at nearly the same center with nearly the same size.</p>
     */
    aboutEquals(moduleSize: number, i: number, j: number): boolean;
    /**
     * Combines this object's current estimate of a finder pattern position and module size
     * with a new estimate. It returns a new {@code FinderPattern} containing a weighted average
     * based on count.
     */
    combineEstimate(i: number, j: number, newModuleSize: number): FinderPattern;
}
