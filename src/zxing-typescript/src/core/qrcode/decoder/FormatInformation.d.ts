import ErrorCorrectionLevel from './ErrorCorrectionLevel';
/**
 * <p>Encapsulates a QR Code's format information, including the data mask used and
 * error correction level.</p>
 *
 * @author Sean Owen
 * @see DataMask
 * @see ErrorCorrectionLevel
 */
export default class FormatInformation {
    private static FORMAT_INFO_MASK_QR;
    /**
     * See ISO 18004:2006, Annex C, Table C.1
     */
    private static FORMAT_INFO_DECODE_LOOKUP;
    private errorCorrectionLevel;
    private dataMask;
    private constructor(formatInfo);
    static numBitsDiffering(a: number, b: number): number;
    /**
     * @param maskedFormatInfo1 format info indicator, with mask still applied
     * @param maskedFormatInfo2 second copy of same info; both are checked at the same time
     *  to establish best match
     * @return information about the format it specifies, or {@code null}
     *  if doesn't seem to match any known pattern
     */
    static decodeFormatInformation(maskedFormatInfo1: number, maskedFormatInfo2: number): FormatInformation;
    private static doDecodeFormatInformation(maskedFormatInfo1, maskedFormatInfo2);
    getErrorCorrectionLevel(): ErrorCorrectionLevel;
    getDataMask(): number;
    hashCode(): number;
    equals(o: Object): boolean;
}
