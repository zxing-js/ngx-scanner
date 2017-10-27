/**
 * <p>Encapsulates the result of decoding a matrix of bits. This typically
 * applies to 2D barcode formats. For now it contains the raw bytes obtained,
 * as well as a String interpretation of those bytes, if applicable.</p>
 *
 * @author Sean Owen
 */
export default class DecoderResult {
    private rawBytes;
    private text;
    private byteSegments;
    private ecLevel;
    private structuredAppendSequenceNumber;
    private structuredAppendParity;
    private numBits;
    private errorsCorrected;
    private erasures;
    private other;
    constructor(rawBytes: Uint8Array, text: string, byteSegments: Uint8Array[], ecLevel: string, structuredAppendSequenceNumber: number, structuredAppendParity: number);
    /**
     * @return raw bytes representing the result, or {@code null} if not applicable
     */
    getRawBytes(): Uint8Array;
    /**
     * @return how many bits of {@link #getRawBytes()} are valid; typically 8 times its length
     * @since 3.3.0
     */
    getNumBits(): number;
    /**
     * @param numBits overrides the number of bits that are valid in {@link #getRawBytes()}
     * @since 3.3.0
     */
    setNumBits(numBits: number): void;
    /**
     * @return text representation of the result
     */
    getText(): string;
    /**
     * @return list of byte segments in the result, or {@code null} if not applicable
     */
    getByteSegments(): Uint8Array[];
    /**
     * @return name of error correction level used, or {@code null} if not applicable
     */
    getECLevel(): string;
    /**
     * @return number of errors corrected, or {@code null} if not applicable
     */
    getErrorsCorrected(): number;
    setErrorsCorrected(errorsCorrected: number): void;
    /**
     * @return number of erasures corrected, or {@code null} if not applicable
     */
    getErasures(): number;
    setErasures(erasures: number): void;
    /**
     * @return arbitrary additional metadata
     */
    getOther(): any;
    setOther(other: any): void;
    hasStructuredAppend(): boolean;
    getStructuredAppendParity(): number;
    getStructuredAppendSequenceNumber(): number;
}
