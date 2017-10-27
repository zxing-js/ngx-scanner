/**
 * <p>Encapsulates a point of interest in an image containing a barcode. Typically, this
 * would be the location of a finder pattern or the corner of the barcode, for example.</p>
 *
 * @author Sean Owen
 */
export default class ResultPoint {
    private x;
    private y;
    constructor(x: number, y: number);
    getX(): number;
    getY(): number;
    equals(other: Object): boolean;
    hashCode(): number;
    toString(): string;
    /**
     * Orders an array of three ResultPoints in an order [A,B,C] such that AB is less than AC
     * and BC is less than AC, and the angle between BC and BA is less than 180 degrees.
     *
     * @param patterns array of three {@code ResultPoint} to order
     */
    static orderBestPatterns(patterns: Array<ResultPoint>): void;
    /**
     * @param pattern1 first pattern
     * @param pattern2 second pattern
     * @return distance between two points
     */
    static distance(pattern1: ResultPoint, pattern2: ResultPoint): number;
    /**
     * Returns the z component of the cross product between vectors BC and BA.
     */
    private static crossProductZ(pointA, pointB, pointC);
}
