/**
 * Simply encapsulates a width and height.
 */
export default class Dimension {
    private width;
    private height;
    constructor(width: number, height: number);
    getWidth(): number;
    getHeight(): number;
    equals(other: any): boolean;
    hashCode(): number;
    toString(): string;
}
