/**
 * The purpose of this class hierarchy is to abstract different bitmap implementations across
 * platforms into a standard interface for requesting greyscale luminance values. The interface
 * only provides immutable methods; therefore crop and rotation create copies. This is to ensure
 * that one Reader does not modify the original luminance source and leave it in an unknown state
 * for other Readers in the chain.
 *
 * @author dswitkin@google.com (Daniel Switkin)
 */
declare abstract class LuminanceSource {
    private width;
    private height;
    protected constructor(width: number, height: number);
    /**
     * Fetches one row of luminance data from the underlying platform's bitmap. Values range from
     * 0 (black) to 255 (white). Because Java does not have an unsigned byte type, callers will have
     * to bitwise and with 0xff for each value. It is preferable for implementations of this method
     * to only fetch this row rather than the whole image, since no 2D Readers may be installed and
     * getMatrix() may never be called.
     *
     * @param y The row to fetch, which must be in [0,getHeight())
     * @param row An optional preallocated array. If null or too small, it will be ignored.
     *            Always use the returned object, and ignore the .length of the array.
     * @return An array containing the luminance data.
     */
    abstract getRow(y: number, row?: Uint8ClampedArray): Uint8ClampedArray;
    /**
     * Fetches luminance data for the underlying bitmap. Values should be fetched using:
     * {@code int luminance = array[y * width + x] & 0xff}
     *
     * @return A row-major 2D array of luminance values. Do not use result.length as it may be
     *         larger than width * height bytes on some platforms. Do not modify the contents
     *         of the result.
     */
    abstract getMatrix(): Uint8ClampedArray;
    /**
     * @return The width of the bitmap.
     */
    getWidth(): number;
    /**
     * @return The height of the bitmap.
     */
    getHeight(): number;
    /**
     * @return Whether this subclass supports cropping.
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
    crop(left: number, top: number, width: number, height: number): LuminanceSource;
    /**
     * @return Whether this subclass supports counter-clockwise rotation.
     */
    isRotateSupported(): boolean;
    /**
     * @return a wrapper of this {@code LuminanceSource} which inverts the luminances it returns -- black becomes
     *  white and vice versa, and each value becomes (255-value).
     */
    abstract invert(): LuminanceSource;
    /**
     * Returns a new object with rotated image data by 90 degrees counterclockwise.
     * Only callable if {@link #isRotateSupported()} is true.
     *
     * @return A rotated version of this object.
     */
    rotateCounterClockwise(): LuminanceSource;
    /**
     * Returns a new object with rotated image data by 45 degrees counterclockwise.
     * Only callable if {@link #isRotateSupported()} is true.
     *
     * @return A rotated version of this object.
     */
    rotateCounterClockwise45(): LuminanceSource;
    toString(): string;
}
export default LuminanceSource;
