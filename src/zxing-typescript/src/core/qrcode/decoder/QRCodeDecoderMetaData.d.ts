import ResultPoint from './../../ResultPoint';
/**
 * Meta-data container for QR Code decoding. Instances of this class may be used to convey information back to the
 * decoding caller. Callers are expected to process this.
 *
 * @see com.google.zxing.common.DecoderResult#getOther()
 */
export default class QRCodeDecoderMetaData {
    private mirrored;
    constructor(mirrored: boolean);
    /**
     * @return true if the QR Code was mirrored.
     */
    isMirrored(): boolean;
    /**
     * Apply the result points' order correction due to mirroring.
     *
     * @param points Array of points to apply mirror correction to.
     */
    applyMirroredCorrection(points: Array<ResultPoint>): void;
}
