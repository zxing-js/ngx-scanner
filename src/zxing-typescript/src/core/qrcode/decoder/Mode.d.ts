import Version from './Version';
export declare const enum ModeValues {
    TERMINATOR = 0,
    NUMERIC = 1,
    ALPHANUMERIC = 2,
    STRUCTURED_APPEND = 3,
    BYTE = 4,
    ECI = 5,
    KANJI = 6,
    FNC1_FIRST_POSITION = 7,
    FNC1_SECOND_POSITION = 8,
    /** See GBT 18284-2000; "Hanzi" is a transliteration of this mode name. */
    HANZI = 9,
}
/**
 * <p>See ISO 18004:2006, 6.4.1, Tables 2 and 3. This enum encapsulates the various modes in which
 * data can be encoded to bits in the QR code standard.</p>
 *
 * @author Sean Owen
 */
export default class Mode {
    private value;
    private stringValue;
    private characterCountBitsForVersions;
    private bits;
    private static FOR_BITS;
    private static FOR_VALUE;
    static TERMINATOR: Mode;
    static NUMERIC: Mode;
    static ALPHANUMERIC: Mode;
    static STRUCTURED_APPEND: Mode;
    static BYTE: Mode;
    static ECI: Mode;
    static KANJI: Mode;
    static FNC1_FIRST_POSITION: Mode;
    static FNC1_SECOND_POSITION: Mode;
    /** See GBT 18284-2000; "Hanzi" is a transliteration of this mode name. */
    static HANZI: Mode;
    private constructor(value, stringValue, characterCountBitsForVersions, bits);
    /**
     * @param bits four bits encoding a QR Code data mode
     * @return Mode encoded by these bits
     * @throws IllegalArgumentException if bits do not correspond to a known mode
     */
    static forBits(bits: number): Mode;
    /**
     * @param version version in question
     * @return number of bits used, in this QR Code symbol {@link Version}, to encode the
     *         count of characters that will follow encoded in this Mode
     */
    getCharacterCountBits(version: Version): number;
    getValue(): ModeValues;
    getBits(): number;
    equals(o: any): boolean;
    toString(): string;
}
