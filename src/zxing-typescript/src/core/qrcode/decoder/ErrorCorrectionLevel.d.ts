export declare const enum ErrorCorrectionLevelValues {
    L = 0,
    M = 1,
    Q = 2,
    H = 3,
}
/**
 * <p>See ISO 18004:2006, 6.5.1. This enum encapsulates the four error correction levels
 * defined by the QR code standard.</p>
 *
 * @author Sean Owen
 */
export default class ErrorCorrectionLevel {
    private value;
    private stringValue;
    private bits;
    private static FOR_BITS;
    private static FOR_VALUE;
    /** L = ~7% correction */
    static L: ErrorCorrectionLevel;
    /** M = ~15% correction */
    static M: ErrorCorrectionLevel;
    /** Q = ~25% correction */
    static Q: ErrorCorrectionLevel;
    /** H = ~30% correction */
    static H: ErrorCorrectionLevel;
    private constructor(value, stringValue, bits);
    getValue(): ErrorCorrectionLevelValues;
    getBits(): number;
    static fromString(s: string): ErrorCorrectionLevel;
    toString(): string;
    equals(o: any): boolean;
    /**
     * @param bits int containing the two bits encoding a QR Code's error correction level
     * @return ErrorCorrectionLevel representing the encoded error correction level
     */
    static forBits(bits: number): ErrorCorrectionLevel;
}
