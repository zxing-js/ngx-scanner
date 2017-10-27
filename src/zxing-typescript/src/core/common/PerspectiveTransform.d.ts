/**
 * <p>This class implements a perspective transform in two dimensions. Given four source and four
 * destination points, it will compute the transformation implied between them. The code is based
 * directly upon section 3.4.2 of George Wolberg's "Digital Image Warping"; see pages 54-56.</p>
 *
 * @author Sean Owen
 */
export default class PerspectiveTransform {
    private a11;
    private a21;
    private a31;
    private a12;
    private a22;
    private a32;
    private a13;
    private a23;
    private a33;
    private constructor(a11, a21, a31, a12, a22, a32, a13, a23, a33);
    static quadrilateralToQuadrilateral(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x0p: number, y0p: number, x1p: number, y1p: number, x2p: number, y2p: number, x3p: number, y3p: number): PerspectiveTransform;
    transformPoints(points: Float32Array): void;
    transformPointsWithValues(xValues: Float32Array, yValues: Float32Array): void;
    static squareToQuadrilateral(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): PerspectiveTransform;
    static quadrilateralToSquare(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): PerspectiveTransform;
    protected buildAdjoint(): PerspectiveTransform;
    protected times(other: PerspectiveTransform): PerspectiveTransform;
}
