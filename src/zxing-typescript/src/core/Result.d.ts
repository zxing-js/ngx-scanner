import ResultPoint from './ResultPoint';
import BarcodeFormat from './BarcodeFormat';
import ResultMetadataType from './ResultMetadataType';
/**
 * <p>Encapsulates the result of decoding a barcode within an image.</p>
 *
 * @author Sean Owen
 */
export default class Result {
    private text;
    private rawBytes;
    private numBits;
    private resultPoints;
    private format;
    private timestamp;
    private resultMetadata;
    constructor(text: string, rawBytes: Uint8Array, numBits: number, resultPoints: Array<ResultPoint>, format: BarcodeFormat, timestamp: number);
    /**
     * @return raw text encoded by the barcode
     */
    getText(): string;
    /**
     * @return raw bytes encoded by the barcode, if applicable, otherwise {@code null}
     */
    getRawBytes(): Uint8Array;
    /**
     * @return how many bits of {@link #getRawBytes()} are valid; typically 8 times its length
     * @since 3.3.0
     */
    getNumBits(): number;
    /**
     * @return points related to the barcode in the image. These are typically points
     *         identifying finder patterns or the corners of the barcode. The exact meaning is
     *         specific to the type of barcode that was decoded.
     */
    getResultPoints(): Array<ResultPoint>;
    /**
     * @return {@link BarcodeFormat} representing the format of the barcode that was decoded
     */
    getBarcodeFormat(): BarcodeFormat;
    /**
     * @return {@link Map} mapping {@link ResultMetadataType} keys to values. May be
     *   {@code null}. This contains optional metadata about what was detected about the barcode,
     *   like orientation.
     */
    getResultMetadata(): Map<ResultMetadataType, Object>;
    putMetadata(type: ResultMetadataType, value: Object): void;
    putAllMetadata(metadata: Map<ResultMetadataType, Object>): void;
    addResultPoints(newPoints: Array<ResultPoint>): void;
    getTimestamp(): number;
    toString(): string;
}
