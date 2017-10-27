import LuminanceSource from './LuminanceSource';
/**
 * A wrapper implementation of {@link LuminanceSource} which inverts the luminances it returns -- black becomes
 * white and vice versa, and each value becomes (255-value).
 *
 * @author Sean Owen
 */
export default class InvertedLuminanceSource extends LuminanceSource {
    private delegate;
    constructor(delegate: LuminanceSource);
    getRow(y: number, row?: Uint8ClampedArray): Uint8ClampedArray;
    getMatrix(): Uint8ClampedArray;
    isCropSupported(): boolean;
    crop(left: number, top: number, width: number, height: number): LuminanceSource;
    isRotateSupported(): boolean;
    /**
     * @return original delegate {@link LuminanceSource} since invert undoes itself
     */
    invert(): LuminanceSource;
    rotateCounterClockwise(): LuminanceSource;
    rotateCounterClockwise45(): LuminanceSource;
}
