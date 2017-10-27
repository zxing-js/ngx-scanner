import LuminanceSource from './../core/LuminanceSource';
export default class HTMLCanvasElementLuminanceSource extends LuminanceSource {
    private canvas;
    private buffer;
    private static DEGREE_TO_RADIANS;
    private tempCanvasElement;
    constructor(canvas: HTMLCanvasElement);
    private static makeBufferFromCanvasImageData(canvas);
    private static toGrayscaleBuffer(imageBuffer, width, height);
    getRow(y: number, row: Uint8ClampedArray): Uint8ClampedArray;
    getMatrix(): Uint8ClampedArray;
    isCropSupported(): boolean;
    crop(left: number, top: number, width: number, height: number): LuminanceSource;
    /**
     * This is always true, since the image is a gray-scale image.
     *
     * @return true
     */
    isRotateSupported(): boolean;
    rotateCounterClockwise(): LuminanceSource;
    rotateCounterClockwise45(): LuminanceSource;
    private getTempCanvasElement();
    private rotate(angle);
    invert(): LuminanceSource;
}
