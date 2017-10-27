import GenericGF from './GenericGF';
/**
 * <p>Implements Reed-Solomon encoding, as the name implies.</p>
 *
 * @author Sean Owen
 * @author William Rucklidge
 */
export default class ReedSolomonEncoder {
    private field;
    private cachedGenerators;
    constructor(field: GenericGF);
    private buildGenerator(degree);
    encode(toEncode: Int32Array, ecBytes: number): void;
}
