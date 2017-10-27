import Binarizer from './Binarizer';
import BitArray from './common/BitArray';
import BitMatrix from './common/BitMatrix';
export default class BinaryBitmap {
    private binarizer;
    private matrix;
    constructor(binarizer: Binarizer);
    /**
     * @return The width of the bitmap.
     */
    getWidth(): number;
    /**
     * @return The height of the bitmap.
     */
    getHeight(): number;
    /**
     * Converts one row of luminance data to 1 bit data. May actually do the conversion, or return
     * cached data. Callers should assume this method is expensive and call it as seldom as possible.
     * This method is intended for decoding 1D barcodes and may choose to apply sharpening.
     *
     * @param y The row to fetch, which must be in [0, bitmap height)
     * @param row An optional preallocated array. If null or too small, it will be ignored.
     *            If used, the Binarizer will call BitArray.clear(). Always use the returned object.
     * @return The array of bits for this row (true means black).
     * @throws NotFoundException if row can't be binarized
     */
    getBlackRow(y: number, row: BitArray): BitArray;
    /**
     * Converts a 2D array of luminance data to 1 bit. As above, assume this method is expensive
     * and do not call it repeatedly. This method is intended for decoding 2D barcodes and may or
     * may not apply sharpening. Therefore, a row from this matrix may not be identical to one
     * fetched using getBlackRow(), so don't mix and match between them.
     *
     * @return The 2D array of bits for the image (true means black).
     * @throws NotFoundException if image can't be binarized to make a matrix
     */
    getBlackMatrix(): BitMatrix;
    /**
     * @return Whether this bitmap can be cropped.
     */
    isCropSupported(): boolean;
    /**
     * Returns a new object with cropped image data. Implementations may keep a reference to the
     * original data rather than a copy. Only callable if isCropSupported() is true.
     *
     * @param left The left coordinate, which must be in [0,getWidth())
     * @param top The top coordinate, which must be in [0,getHeight())
     * @param width The width of the rectangle to crop.
     * @param height The height of the rectangle to crop.
     * @return A cropped version of this object.
     */
    crop(left: number, top: number, width: number, height: number): BinaryBitmap;
    /**
     * @return Whether this bitmap supports counter-clockwise rotation.
     */
    isRotateSupported(): boolean;
    /**
     * Returns a new object with rotated image data by 90 degrees counterclockwise.
     * Only callable if {@link #isRotateSupported()} is true.
     *
     * @return A rotated version of this object.
     */
    rotateCounterClockwise(): BinaryBitmap;
    /**
     * Returns a new object with rotated image data by 45 degrees counterclockwise.
     * Only callable if {@link #isRotateSupported()} is true.
     *
     * @return A rotated version of this object.
     */
    rotateCounterClockwise45(): BinaryBitmap;
    toString(): string;
}
