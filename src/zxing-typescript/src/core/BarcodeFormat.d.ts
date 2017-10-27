/**
 * Enumerates barcode formats known to this package. Please keep alphabetized.
 *
 * @author Sean Owen
 */
declare const enum BarcodeFormat {
    /** Aztec 2D barcode format. */
    AZTEC = 0,
    /** CODABAR 1D format. */
    CODABAR = 1,
    /** Code 39 1D format. */
    CODE_39 = 2,
    /** Code 93 1D format. */
    CODE_93 = 3,
    /** Code 128 1D format. */
    CODE_128 = 4,
    /** Data Matrix 2D barcode format. */
    DATA_MATRIX = 5,
    /** EAN-8 1D format. */
    EAN_8 = 6,
    /** EAN-13 1D format. */
    EAN_13 = 7,
    /** ITF (Interleaved Two of Five) 1D format. */
    ITF = 8,
    /** MaxiCode 2D barcode format. */
    MAXICODE = 9,
    /** PDF417 format. */
    PDF_417 = 10,
    /** QR Code 2D barcode format. */
    QR_CODE = 11,
    /** RSS 14 */
    RSS_14 = 12,
    /** RSS EXPANDED */
    RSS_EXPANDED = 13,
    /** UPC-A 1D format. */
    UPC_A = 14,
    /** UPC-E 1D format. */
    UPC_E = 15,
    /** UPC/EAN extension format. Not a stand-alone format. */
    UPC_EAN_EXTENSION = 16,
}
export default BarcodeFormat;
