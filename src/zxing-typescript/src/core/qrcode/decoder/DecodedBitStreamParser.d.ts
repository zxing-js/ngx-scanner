import DecodeHintType from './../../DecodeHintType';
import DecoderResult from './../../common/DecoderResult';
import Version from './Version';
import ErrorCorrectionLevel from './ErrorCorrectionLevel';
/**
 * <p>QR Codes can encode text as bits in one of several modes, and can use multiple modes
 * in one QR Code. This class decodes the bits back into text.</p>
 *
 * <p>See ISO 18004:2006, 6.4.3 - 6.4.7</p>
 *
 * @author Sean Owen
 */
export default class DecodedBitStreamParser {
    /**
     * See ISO 18004:2006, 6.4.4 Table 5
     */
    private static ALPHANUMERIC_CHARS;
    private static GB2312_SUBSET;
    static decode(bytes: Uint8Array, version: Version, ecLevel: ErrorCorrectionLevel, hints: Map<DecodeHintType, any>): DecoderResult;
    /**
     * See specification GBT 18284-2000
     */
    private static decodeHanziSegment(bits, result, count);
    private static decodeKanjiSegment(bits, result, count);
    private static decodeByteSegment(bits, result, count, currentCharacterSetECI, byteSegments, hints);
    private static toAlphaNumericChar(value);
    private static decodeAlphanumericSegment(bits, result, count, fc1InEffect);
    private static decodeNumericSegment(bits, result, count);
    private static parseECIValue(bits);
}
