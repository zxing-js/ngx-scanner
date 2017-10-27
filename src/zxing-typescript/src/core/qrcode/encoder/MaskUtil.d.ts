import ByteMatrix from './ByteMatrix';
/**
 * @author Satoru Takabayashi
 * @author Daniel Switkin
 * @author Sean Owen
 */
export default class MaskUtil {
    private static N1;
    private static N2;
    private static N3;
    private static N4;
    private constructor();
    /**
     * Apply mask penalty rule 1 and return the penalty. Find repetitive cells with the same color and
     * give penalty to them. Example: 00000 or 11111.
     */
    static applyMaskPenaltyRule1(matrix: ByteMatrix): number;
    /**
     * Apply mask penalty rule 2 and return the penalty. Find 2x2 blocks with the same color and give
     * penalty to them. This is actually equivalent to the spec's rule, which is to find MxN blocks and give a
     * penalty proportional to (M-1)x(N-1), because this is the number of 2x2 blocks inside such a block.
     */
    static applyMaskPenaltyRule2(matrix: ByteMatrix): number;
    /**
     * Apply mask penalty rule 3 and return the penalty. Find consecutive runs of 1:1:3:1:1:4
     * starting with black, or 4:1:1:3:1:1 starting with white, and give penalty to them.  If we
     * find patterns like 000010111010000, we give penalty once.
     */
    static applyMaskPenaltyRule3(matrix: ByteMatrix): number;
    private static isWhiteHorizontal(rowArray, from, to);
    private static isWhiteVertical(array, col, from, to);
    /**
     * Apply mask penalty rule 4 and return the penalty. Calculate the ratio of dark cells and give
     * penalty if the ratio is far from 50%. It gives 10 penalty for 5% distance.
     */
    static applyMaskPenaltyRule4(matrix: ByteMatrix): number;
    /**
     * Return the mask bit for "getMaskPattern" at "x" and "y". See 8.8 of JISX0510:2004 for mask
     * pattern conditions.
     */
    static getDataMaskBit(maskPattern: number, x: number, y: number): boolean;
    /**
     * Helper function for applyMaskPenaltyRule1. We need this for doing this calculation in both
     * vertical and horizontal orders respectively.
     */
    private static applyMaskPenaltyRule1Internal(matrix, isHorizontal);
}
