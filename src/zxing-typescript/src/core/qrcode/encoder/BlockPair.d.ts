export default class BlockPair {
    private dataBytes;
    private errorCorrectionBytes;
    constructor(dataBytes: Uint8Array, errorCorrectionBytes: Uint8Array);
    getDataBytes(): Uint8Array;
    getErrorCorrectionBytes(): Uint8Array;
}
