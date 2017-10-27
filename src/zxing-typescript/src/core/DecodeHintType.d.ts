/**
 * Encapsulates a type of hint that a caller may pass to a barcode reader to help it
 * more quickly or accurately decode it. It is up to implementations to decide what,
 * if anything, to do with the information that is supplied.
 *
 * @author Sean Owen
 * @author dswitkin@google.com (Daniel Switkin)
 * @see Reader#decode(BinaryBitmap,java.util.Map)
 */
declare const enum DecodeHintType {
    /**
     * Unspecified, application-specific hint. Maps to an unspecified {@link Object}.
     */
    OTHER = 0,
    /**
     * Image is a pure monochrome image of a barcode. Doesn't matter what it maps to;
     * use {@link Boolean#TRUE}.
     */
    PURE_BARCODE = 1,
    /**
     * Image is known to be of one of a few possible formats.
     * Maps to a {@link List} of {@link BarcodeFormat}s.
     */
    POSSIBLE_FORMATS = 2,
    /**
     * Spend more time to try to find a barcode; optimize for accuracy, not speed.
     * Doesn't matter what it maps to; use {@link Boolean#TRUE}.
     */
    TRY_HARDER = 3,
    /**
     * Specifies what character encoding to use when decoding, where applicable (type String)
     */
    CHARACTER_SET = 4,
    /**
     * Allowed lengths of encoded data -- reject anything else. Maps to an {@code Int32Array}.
     */
    ALLOWED_LENGTHS = 5,
    /**
     * Assume Code 39 codes employ a check digit. Doesn't matter what it maps to;
     * use {@link Boolean#TRUE}.
     */
    ASSUME_CODE_39_CHECK_DIGIT = 6,
    /**
     * Assume the barcode is being processed as a GS1 barcode, and modify behavior as needed.
     * For example this affects FNC1 handling for Code 128 (aka GS1-128). Doesn't matter what it maps to;
     * use {@link Boolean#TRUE}.
     */
    ASSUME_GS1 = 7,
    /**
     * If true, return the start and end digits in a Codabar barcode instead of stripping them. They
     * are alpha, whereas the rest are numeric. By default, they are stripped, but this causes them
     * to not be. Doesn't matter what it maps to; use {@link Boolean#TRUE}.
     */
    RETURN_CODABAR_START_END = 8,
    /**
     * The caller needs to be notified via callback when a possible {@link ResultPoint}
     * is found. Maps to a {@link ResultPointCallback}.
     */
    NEED_RESULT_POINT_CALLBACK = 9,
    /**
     * Allowed extension lengths for EAN or UPC barcodes. Other formats will ignore this.
     * Maps to an {@code Int32Array} of the allowed extension lengths, for example [2], [5], or [2, 5].
     * If it is optional to have an extension, do not set this hint. If this is set,
     * and a UPC or EAN barcode is found but an extension is not, then no result will be returned
     * at all.
     */
    ALLOWED_EAN_EXTENSIONS = 10,
}
export default DecodeHintType;
