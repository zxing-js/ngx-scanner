import BitArray from './BitArray';
/**
 * <p>Represents a 2D matrix of bits. In function arguments below, and throughout the common
 * module, x is the column position, and y is the row position. The ordering is always x, y.
 * The origin is at the top-left.</p>
 *
 * <p>Internally the bits are represented in a 1-D array of 32-bit ints. However, each row begins
 * with a new int. This is done intentionally so that we can copy out a row into a BitArray very
 * efficiently.</p>
 *
 * <p>The ordering of bits is row-major. Within each int, the least significant bits are used first,
 * meaning they represent lower x values. This is compatible with BitArray's implementation.</p>
 *
 * @author Sean Owen
 * @author dswitkin@google.com (Daniel Switkin)
 */
export default class BitMatrix {
    private width;
    private height;
    private rowSize;
    private bits;
    /**
     * Creates an empty square {@link BitMatrix}.
     *
     * @param dimension height and width
     */
    /**
     * Creates an empty {@link BitMatrix}.
     *
     * @param width bit matrix width
     * @param height bit matrix height
     */
    constructor(width: number, height?: number, rowSize?: number, bits?: Int32Array);
    /**
     * Interprets a 2D array of booleans as a {@link BitMatrix}, where "true" means an "on" bit.
     *
     * @param image bits of the image, as a row-major 2D array. Elements are arrays representing rows
     * @return {@link BitMatrix} representation of image
     */
    static parseFromBooleanArray(image: boolean[][]): BitMatrix;
    static parseFromString(stringRepresentation: string, setString: string, unsetString: string): BitMatrix;
    /**
     * <p>Gets the requested bit, where true means black.</p>
     *
     * @param x The horizontal component (i.e. which column)
     * @param y The vertical component (i.e. which row)
     * @return value of given bit in matrix
     */
    get(x: number, y: number): boolean;
    /**
     * <p>Sets the given bit to true.</p>
     *
     * @param x The horizontal component (i.e. which column)
     * @param y The vertical component (i.e. which row)
     */
    set(x: number, y: number): void;
    unset(x: number, y: number): void;
    /**
     * <p>Flips the given bit.</p>
     *
     * @param x The horizontal component (i.e. which column)
     * @param y The vertical component (i.e. which row)
     */
    flip(x: number, y: number): void;
    /**
     * Exclusive-or (XOR): Flip the bit in this {@code BitMatrix} if the corresponding
     * mask bit is set.
     *
     * @param mask XOR mask
     */
    xor(mask: BitMatrix): void;
    /**
     * Clears all bits (sets to false).
     */
    clear(): void;
    /**
     * <p>Sets a square region of the bit matrix to true.</p>
     *
     * @param left The horizontal position to begin at (inclusive)
     * @param top The vertical position to begin at (inclusive)
     * @param width The width of the region
     * @param height The height of the region
     */
    setRegion(left: number, top: number, width: number, height: number): void;
    /**
     * A fast method to retrieve one row of data from the matrix as a BitArray.
     *
     * @param y The row to retrieve
     * @param row An optional caller-allocated BitArray, will be allocated if null or too small
     * @return The resulting BitArray - this reference should always be used even when passing
     *         your own row
     */
    getRow(y: number, row?: BitArray): BitArray;
    /**
     * @param y row to set
     * @param row {@link BitArray} to copy from
     */
    setRow(y: number, row: BitArray): void;
    /**
     * Modifies this {@code BitMatrix} to represent the same but rotated 180 degrees
     */
    rotate180(): void;
    /**
     * This is useful in detecting the enclosing rectangle of a 'pure' barcode.
     *
     * @return {@code left,top,width,height} enclosing rectangle of all 1 bits, or null if it is all white
     */
    getEnclosingRectangle(): Int32Array;
    /**
     * This is useful in detecting a corner of a 'pure' barcode.
     *
     * @return {@code x,y} coordinate of top-left-most 1 bit, or null if it is all white
     */
    getTopLeftOnBit(): Int32Array;
    getBottomRightOnBit(): Int32Array;
    /**
     * @return The width of the matrix
     */
    getWidth(): number;
    /**
     * @return The height of the matrix
     */
    getHeight(): number;
    /**
     * @return The row size of the matrix
     */
    getRowSize(): number;
    equals(o: Object): boolean;
    hashCode(): number;
    /**
     * @return string representation using "X" for set and " " for unset bits
     */
    /**
     * @param setString representation of a set bit
     * @param unsetString representation of an unset bit
     * @return string representation of entire matrix utilizing given strings
     */
    /**
     * @param setString representation of a set bit
     * @param unsetString representation of an unset bit
     * @param lineSeparator newline character in string representation
     * @return string representation of entire matrix utilizing given strings and line separator
     * @deprecated call {@link #toString(String,String)} only, which uses \n line separator always
     */
    toString(setString?: string, unsetString?: string, lineSeparator?: string): string;
    private buildToString(setString, unsetString, lineSeparator);
    clone(): BitMatrix;
}
