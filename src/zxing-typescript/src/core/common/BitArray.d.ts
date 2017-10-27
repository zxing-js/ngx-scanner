/**
 * <p>A simple, fast array of bits, represented compactly by an array of ints internally.</p>
 *
 * @author Sean Owen
 */
export default class BitArray {
    private size;
    private bits;
    constructor(size?: number, bits?: Int32Array);
    getSize(): number;
    getSizeInBytes(): number;
    private ensureCapacity(size);
    /**
     * @param i bit to get
     * @return true iff bit i is set
     */
    get(i: number): boolean;
    /**
     * Sets bit i.
     *
     * @param i bit to set
     */
    set(i: number): void;
    /**
     * Flips bit i.
     *
     * @param i bit to set
     */
    flip(i: number): void;
    /**
     * @param from first bit to check
     * @return index of first bit that is set, starting from the given index, or size if none are set
     *  at or beyond this given index
     * @see #getNextUnset(int)
     */
    getNextSet(from: number): number;
    /**
     * @param from index to start looking for unset bit
     * @return index of next unset bit, or {@code size} if none are unset until the end
     * @see #getNextSet(int)
     */
    getNextUnset(from: number): number;
    /**
     * Sets a block of 32 bits, starting at bit i.
     *
     * @param i first bit to set
     * @param newBits the new value of the next 32 bits. Note again that the least-significant bit
     * corresponds to bit i, the next-least-significant to i+1, and so on.
     */
    setBulk(i: number, newBits: number): void;
    /**
     * Sets a range of bits.
     *
     * @param start start of range, inclusive.
     * @param end end of range, exclusive
     */
    setRange(start: number, end: number): void;
    /**
     * Clears all bits (sets to false).
     */
    clear(): void;
    /**
     * Efficient method to check if a range of bits is set, or not set.
     *
     * @param start start of range, inclusive.
     * @param end end of range, exclusive
     * @param value if true, checks that bits in range are set, otherwise checks that they are not set
     * @return true iff all bits are set or not set in range, according to value argument
     * @throws IllegalArgumentException if end is less than start or the range is not contained in the array
     */
    isRange(start: number, end: number, value: boolean): boolean;
    appendBit(bit: boolean): void;
    /**
     * Appends the least-significant bits, from value, in order from most-significant to
     * least-significant. For example, appending 6 bits from 0x000001E will append the bits
     * 0, 1, 1, 1, 1, 0 in that order.
     *
     * @param value {@code int} containing bits to append
     * @param numBits bits from value to append
     */
    appendBits(value: number, numBits: number): void;
    appendBitArray(other: BitArray): void;
    xor(other: BitArray): void;
    /**
     *
     * @param bitOffset first bit to start writing
     * @param array array to write into. Bytes are written most-significant byte first. This is the opposite
     *  of the internal representation, which is exposed by {@link #getBitArray()}
     * @param offset position in array to start writing
     * @param numBytes how many bytes to write
     */
    toBytes(bitOffset: number, array: Uint8Array, offset: number, numBytes: number): void;
    /**
     * @return underlying array of ints. The first element holds the first 32 bits, and the least
     *         significant bit is bit 0.
     */
    getBitArray(): Int32Array;
    /**
     * Reverses all bits in the array.
     */
    reverse(): void;
    private static makeArray(size);
    equals(o: any): boolean;
    hashCode(): number;
    toString(): string;
    clone(): BitArray;
}
