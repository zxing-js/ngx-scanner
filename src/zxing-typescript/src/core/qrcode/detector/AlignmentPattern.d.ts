import ResultPoint from './../../ResultPoint';
/**
 * <p>Encapsulates an alignment pattern, which are the smaller square patterns found in
 * all but the simplest QR Codes.</p>
 *
 * @author Sean Owen
 */
export default class AlignmentPattern extends ResultPoint {
    private estimatedModuleSize;
    constructor(posX: number, posY: number, estimatedModuleSize: number);
    /**
     * <p>Determines if this alignment pattern "about equals" an alignment pattern at the stated
     * position and size -- meaning, it is at nearly the same center with nearly the same size.</p>
     */
    aboutEquals(moduleSize: number, i: number, j: number): boolean;
    /**
     * Combines this object's current estimate of a finder pattern position and module size
     * with a new estimate. It returns a new {@code FinderPattern} containing an average of the two.
     */
    combineEstimate(i: number, j: number, newModuleSize: number): AlignmentPattern;
}
