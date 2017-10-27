import './InvertedLuminanceSource';
import LuminanceSource from './LuminanceSource';
/**
 * This class is used to help decode images from files which arrive as RGB data from
 * an ARGB pixel array. It does not support rotation.
 *
 * @author dswitkin@google.com (Daniel Switkin)
 * @author Betaminos
 */
export default class RGBLuminanceSource extends LuminanceSource {
    private dataWidth;
    private dataHeight;
    private left;
    private top;
    private luminances;
    constructor(luminances: Uint8ClampedArray | Int32Array, width: number, height: number, dataWidth?: number, dataHeight?: number, left?: number, top?: number);
    getRow(y: number, row?: Uint8ClampedArray): Uint8ClampedArray;
    getMatrix(): Uint8ClampedArray;
    isCropSupported(): boolean;
    crop(left: number, top: number, width: number, height: number): LuminanceSource;
    invert(): LuminanceSource;
}
