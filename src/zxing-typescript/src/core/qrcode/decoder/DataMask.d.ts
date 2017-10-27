import BitMatrix from './../../common/BitMatrix';
export declare const enum DataMaskValues {
    DATA_MASK_000 = 0,
    DATA_MASK_001 = 1,
    DATA_MASK_010 = 2,
    DATA_MASK_011 = 3,
    DATA_MASK_100 = 4,
    DATA_MASK_101 = 5,
    DATA_MASK_110 = 6,
    DATA_MASK_111 = 7,
}
/**
 * <p>Encapsulates data masks for the data bits in a QR code, per ISO 18004:2006 6.8. Implementations
 * of this class can un-mask a raw BitMatrix. For simplicity, they will unmask the entire BitMatrix,
 * including areas used for finder patterns, timing patterns, etc. These areas should be unused
 * after the point they are unmasked anyway.</p>
 *
 * <p>Note that the diagram in section 6.8.1 is misleading since it indicates that i is column position
 * and j is row position. In fact, as the text says, i is row position and j is column position.</p>
 *
 * @author Sean Owen
 */
export default class DataMask {
    private value;
    private isMasked;
    constructor(value: DataMaskValues, isMasked: (i: number, j: number) => boolean);
    static values: Map<DataMaskValues, DataMask>;
    /**
     * <p>Implementations of this method reverse the data masking process applied to a QR Code and
     * make its bits ready to read.</p>
     *
     * @param bits representation of QR Code bits
     * @param dimension dimension of QR Code, represented by bits, being unmasked
     */
    unmaskBitMatrix(bits: BitMatrix, dimension: number): void;
}
