/**
 * These are a set of hints that you may pass to Writers to specify their behavior.
 *
 * @author dswitkin@google.com (Daniel Switkin)
 */
declare enum EncodeHintType {
    /**
     * Specifies what degree of error correction to use, for example in QR Codes.
     * Type depends on the encoder. For example for QR codes it's type
     * {@link com.google.zxing.qrcode.decoder.ErrorCorrectionLevel ErrorCorrectionLevel}.
     * For Aztec it is of type {@link Integer}, representing the minimal percentage of error correction words.
     * For PDF417 it is of type {@link Integer}, valid values being 0 to 8.
     * In all cases, it can also be a {@link String} representation of the desired value as well.
     * Note: an Aztec symbol should have a minimum of 25% EC words.
     */
    ERROR_CORRECTION = 0,
    /**
     * Specifies what character encoding to use where applicable (type {@link String})
     */
    CHARACTER_SET = 1,
    /**
     * Specifies the matrix shape for Data Matrix (type {@link com.google.zxing.datamatrix.encoder.SymbolShapeHint})
     */
    DATA_MATRIX_SHAPE = 2,
    /**
     * Specifies a minimum barcode size (type {@link Dimension}). Only applicable to Data Matrix now.
     *
     * @deprecated use width/height params in
     * {@link com.google.zxing.datamatrix.DataMatrixWriter#encode(String, BarcodeFormat, int, int)}
     */
    MIN_SIZE = 3,
    /**
     * Specifies a maximum barcode size (type {@link Dimension}). Only applicable to Data Matrix now.
     *
     * @deprecated without replacement
     */
    MAX_SIZE = 4,
    /**
     * Specifies margin, in pixels, to use when generating the barcode. The meaning can vary
     * by format; for example it controls margin before and after the barcode horizontally for
     * most 1D formats. (Type {@link Integer}, or {@link String} representation of the integer value).
     */
    MARGIN = 5,
    /**
     * Specifies whether to use compact mode for PDF417 (type {@link Boolean}, or "true" or "false"
     * {@link String} value).
     */
    PDF417_COMPACT = 6,
    /**
     * Specifies what compaction mode to use for PDF417 (type
     * {@link com.google.zxing.pdf417.encoder.Compaction Compaction} or {@link String} value of one of its
     * enum values).
     */
    PDF417_COMPACTION = 7,
    /**
     * Specifies the minimum and maximum number of rows and columns for PDF417 (type
     * {@link com.google.zxing.pdf417.encoder.Dimensions Dimensions}).
     */
    PDF417_DIMENSIONS = 8,
    /**
     * Specifies the required number of layers for an Aztec code.
     * A negative number (-1, -2, -3, -4) specifies a compact Aztec code.
     * 0 indicates to use the minimum number of layers (the default).
     * A positive number (1, 2, .. 32) specifies a normal (non-compact) Aztec code.
     * (Type {@link Integer}, or {@link String} representation of the integer value).
     */
    AZTEC_LAYERS = 9,
    /**
     * Specifies the exact version of QR code to be encoded.
     * (Type {@link Integer}, or {@link String} representation of the integer value).
     */
    QR_VERSION = 10,
}
export default EncodeHintType;
