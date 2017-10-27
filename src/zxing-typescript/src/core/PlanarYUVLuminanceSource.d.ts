import LuminanceSource from './LuminanceSource';
/**
 * This object extends LuminanceSource around an array of YUV data returned from the camera driver,
 * with the option to crop to a rectangle within the full data. This can be used to exclude
 * superfluous pixels around the perimeter and speed up decoding.
 *
 * It works for any pixel format where the Y channel is planar and appears first, including
 * YCbCr_420_SP and YCbCr_422_SP.
 *
 * @author dswitkin@google.com (Daniel Switkin)
 */
export default class PlanarYUVLuminanceSource extends LuminanceSource {
    private yuvData;
    private dataWidth;
    private dataHeight;
    private left;
    private top;
    private static THUMBNAIL_SCALE_FACTOR;
    constructor(yuvData: Uint8ClampedArray, dataWidth: number, dataHeight: number, left: number, top: number, width: number, height: number, reverseHorizontal: boolean);
    getRow(y: number, row?: Uint8ClampedArray): Uint8ClampedArray;
    getMatrix(): Uint8ClampedArray;
    isCropSupported(): boolean;
    crop(left: number, top: number, width: number, height: number): LuminanceSource;
    renderThumbnail(): Int32Array;
    /**
     * @return width of image from {@link #renderThumbnail()}
     */
    getThumbnailWidth(): number;
    /**
     * @return height of image from {@link #renderThumbnail()}
     */
    getThumbnailHeight(): number;
    private reverseHorizontal(width, height);
    invert(): LuminanceSource;
}
