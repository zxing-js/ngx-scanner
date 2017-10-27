import BitMatrix from './../../common/BitMatrix';
import Version from './Version';
import FormatInformation from './FormatInformation';
/**
 * @author Sean Owen
 */
export default class BitMatrixParser {
    private bitMatrix;
    private parsedVersion;
    private parsedFormatInfo;
    private isMirror;
    /**
     * @param bitMatrix {@link BitMatrix} to parse
     * @throws FormatException if dimension is not >= 21 and 1 mod 4
     */
    constructor(bitMatrix: BitMatrix);
    /**
     * <p>Reads format information from one of its two locations within the QR Code.</p>
     *
     * @return {@link FormatInformation} encapsulating the QR Code's format info
     * @throws FormatException if both format information locations cannot be parsed as
     * the valid encoding of format information
     */
    readFormatInformation(): FormatInformation;
    /**
     * <p>Reads version information from one of its two locations within the QR Code.</p>
     *
     * @return {@link Version} encapsulating the QR Code's version
     * @throws FormatException if both version information locations cannot be parsed as
     * the valid encoding of version information
     */
    readVersion(): Version;
    private copyBit(i, j, versionBits);
    /**
     * <p>Reads the bits in the {@link BitMatrix} representing the finder pattern in the
     * correct order in order to reconstruct the codewords bytes contained within the
     * QR Code.</p>
     *
     * @return bytes encoded within the QR Code
     * @throws FormatException if the exact number of bytes expected is not read
     */
    readCodewords(): Uint8Array;
    /**
     * Revert the mask removal done while reading the code words. The bit matrix should revert to its original state.
     */
    remask(): void;
    /**
     * Prepare the parser for a mirrored operation.
     * This flag has effect only on the {@link #readFormatInformation()} and the
     * {@link #readVersion()}. Before proceeding with {@link #readCodewords()} the
     * {@link #mirror()} method should be called.
     *
     * @param mirror Whether to read version and format information mirrored.
     */
    setMirror(isMirror: boolean): void;
    /** Mirror the bit matrix in order to attempt a second reading. */
    mirror(): void;
}
