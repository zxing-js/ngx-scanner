import EncodeHintType from './../../EncodeHintType';
import BitArray from './../../common/BitArray';
import ErrorCorrectionLevel from './../decoder/ErrorCorrectionLevel';
import Mode from './../decoder/Mode';
import Version from './../decoder/Version';
import QRCode from './QRCode';
/**
 * @author satorux@google.com (Satoru Takabayashi) - creator
 * @author dswitkin@google.com (Daniel Switkin) - ported from C++
 */
export default class Encoder {
    private static ALPHANUMERIC_TABLE;
    static DEFAULT_BYTE_MODE_ENCODING: string;
    private constructor();
    private static calculateMaskPenalty(matrix);
    /**
     * @param content text to encode
     * @param ecLevel error correction level to use
     * @return {@link QRCode} representing the encoded QR code
     * @throws WriterException if encoding can't succeed, because of for example invalid content
     *   or configuration
     */
    static encode(content: string, ecLevel: ErrorCorrectionLevel, hints?: Map<EncodeHintType, any>): QRCode;
    /**
     * Decides the smallest version of QR code that will contain all of the provided data.
     *
     * @throws WriterException if the data cannot fit in any version
     */
    private static recommendVersion(ecLevel, mode, headerBits, dataBits);
    private static calculateBitsNeeded(mode, headerBits, dataBits, version);
    /**
     * @return the code point of the table used in alphanumeric mode or
     *  -1 if there is no corresponding code in the table.
     */
    static getAlphanumericCode(code: number): number;
    /**
     * Choose the best mode by examining the content. Note that 'encoding' is used as a hint;
     * if it is Shift_JIS, and the input is only double-byte Kanji, then we return {@link Mode#KANJI}.
     */
    static chooseMode(content: string, encoding?: string): Mode;
    private static isOnlyDoubleByteKanji(content);
    private static chooseMaskPattern(bits, ecLevel, version, matrix);
    private static chooseVersion(numInputBits, ecLevel);
    /**
     * @return true if the number of input bits will fit in a code with the specified version and
     * error correction level.
     */
    private static willFit(numInputBits, version, ecLevel);
    /**
     * Terminate bits as described in 8.4.8 and 8.4.9 of JISX0510:2004 (p.24).
     */
    static terminateBits(numDataBytes: number, bits: BitArray): void;
    /**
     * Get number of data bytes and number of error correction bytes for block id "blockID". Store
     * the result in "numDataBytesInBlock", and "numECBytesInBlock". See table 12 in 8.5.1 of
     * JISX0510:2004 (p.30)
     */
    static getNumDataBytesAndNumECBytesForBlockID(numTotalBytes: number, numDataBytes: number, numRSBlocks: number, blockID: number, numDataBytesInBlock: Int32Array, numECBytesInBlock: Int32Array): void;
    /**
     * Interleave "bits" with corresponding error correction bytes. On success, store the result in
     * "result". The interleave rule is complicated. See 8.6 of JISX0510:2004 (p.37) for details.
     */
    static interleaveWithECBytes(bits: BitArray, numTotalBytes: number, numDataBytes: number, numRSBlocks: number): BitArray;
    static generateECBytes(dataBytes: Uint8Array, numEcBytesInBlock: number): Uint8Array;
    /**
     * Append mode info. On success, store the result in "bits".
     */
    static appendModeInfo(mode: Mode, bits: BitArray): void;
    /**
     * Append length info. On success, store the result in "bits".
     */
    static appendLengthInfo(numLetters: number, version: Version, mode: Mode, bits: BitArray): void;
    /**
     * Append "bytes" in "mode" mode (encoding) into "bits". On success, store the result in "bits".
     */
    static appendBytes(content: string, mode: Mode, bits: BitArray, encoding: string): void;
    private static getDigit(singleCharacter);
    private static isDigit(singleCharacter);
    static appendNumericBytes(content: string, bits: BitArray): void;
    static appendAlphanumericBytes(content: string, bits: BitArray): void;
    static append8BitBytes(content: string, bits: BitArray, encoding: string): void;
    static appendKanjiBytes(content: string, bits: BitArray): void;
    private static appendECI(eci, bits);
}
