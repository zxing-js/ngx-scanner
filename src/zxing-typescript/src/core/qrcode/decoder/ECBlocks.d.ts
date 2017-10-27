import ECB from './ECB';
/**
 * <p>Encapsulates a set of error-correction blocks in one symbol version. Most versions will
 * use blocks of differing sizes within one version, so, this encapsulates the parameters for
 * each set of blocks. It also holds the number of error-correction codewords per block since it
 * will be the same across all blocks within one version.</p>
 */
export default class ECBlocks {
    private ecCodewordsPerBlock;
    private ecBlocks;
    constructor(ecCodewordsPerBlock: number, ...ecBlocks: ECB[]);
    getECCodewordsPerBlock(): number;
    getNumBlocks(): number;
    getTotalECCodewords(): number;
    getECBlocks(): ECB[];
}
