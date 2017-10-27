import ErrorCorrectionLevel from './../decoder/ErrorCorrectionLevel';
import Mode from './../decoder/Mode';
import Version from './../decoder/Version';
import ByteMatrix from './ByteMatrix';
/**
 * @author satorux@google.com (Satoru Takabayashi) - creator
 * @author dswitkin@google.com (Daniel Switkin) - ported from C++
 */
export default class QRCode {
    static NUM_MASK_PATTERNS: number;
    private mode;
    private ecLevel;
    private version;
    private maskPattern;
    private matrix;
    constructor();
    getMode(): Mode;
    getECLevel(): ErrorCorrectionLevel;
    getVersion(): Version;
    getMaskPattern(): number;
    getMatrix(): ByteMatrix;
    toString(): string;
    setMode(value: Mode): void;
    setECLevel(value: ErrorCorrectionLevel): void;
    setVersion(version: Version): void;
    setMaskPattern(value: number): void;
    setMatrix(value: ByteMatrix): void;
    static isValidMaskPattern(maskPattern: number): boolean;
}
