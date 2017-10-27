/**
 * JAVAPORT: The original code was a 2D array of ints, but since it only ever gets assigned
 * -1, 0, and 1, I'm going to use less memory and go with bytes.
 *
 * @author dswitkin@google.com (Daniel Switkin)
 */
export default class ByteMatrix {
    private width;
    private height;
    private bytes;
    constructor(width: number, height: number);
    getHeight(): number;
    getWidth(): number;
    get(x: number, y: number): number;
    /**
     * @return an internal representation as bytes, in row-major order. array[y][x] represents point (x,y)
     */
    getArray(): Array<Uint8Array>;
    setNumber(x: number, y: number, value: number): void;
    setBoolean(x: number, y: number, value: boolean): void;
    clear(value: number): void;
    equals(o: any): boolean;
    toString(): string;
}
