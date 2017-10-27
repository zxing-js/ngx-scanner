import BitMatrix from './../../common/BitMatrix';
import ErrorCorrectionLevel from './ErrorCorrectionLevel';
import ECBlocks from './ECBlocks';
/**
 * See ISO 18004:2006 Annex D
 *
 * @author Sean Owen
 */
export default class Version {
    private versionNumber;
    private alignmentPatternCenters;
    /**
       * See ISO 18004:2006 Annex D.
       * Element i represents the raw version bits that specify version i + 7
       */
    private static VERSION_DECODE_INFO;
    /**
       * See ISO 18004:2006 6.5.1 Table 9
       */
    private static VERSIONS;
    private ecBlocks;
    private totalCodewords;
    private constructor(versionNumber, alignmentPatternCenters, ...ecBlocks);
    getVersionNumber(): number;
    getAlignmentPatternCenters(): Int32Array;
    getTotalCodewords(): number;
    getDimensionForVersion(): number;
    getECBlocksForLevel(ecLevel: ErrorCorrectionLevel): ECBlocks;
    /**
     * <p>Deduces version information purely from QR Code dimensions.</p>
     *
     * @param dimension dimension in modules
     * @return Version for a QR Code of that dimension
     * @throws FormatException if dimension is not 1 mod 4
     */
    static getProvisionalVersionForDimension(dimension: number): Version;
    static getVersionForNumber(versionNumber: number): Version;
    static decodeVersionInformation(versionBits: number): Version;
    /**
     * See ISO 18004:2006 Annex E
     */
    buildFunctionPattern(): BitMatrix;
    toString(): string;
}
