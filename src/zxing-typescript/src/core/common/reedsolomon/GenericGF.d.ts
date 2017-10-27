import GenericGFPoly from './GenericGFPoly';
/**
 * <p>This class contains utility methods for performing mathematical operations over
 * the Galois Fields. Operations use a given primitive polynomial in calculations.</p>
 *
 * <p>Throughout this package, elements of the GF are represented as an {@code int}
 * for convenience and speed (but at the cost of memory).
 * </p>
 *
 * @author Sean Owen
 * @author David Olivier
 */
export default class GenericGF {
    private primitive;
    private size;
    private generatorBase;
    static AZTEC_DATA_12: GenericGF;
    static AZTEC_DATA_10: GenericGF;
    static AZTEC_DATA_6: GenericGF;
    static AZTEC_PARAM: GenericGF;
    static QR_CODE_FIELD_256: GenericGF;
    static DATA_MATRIX_FIELD_256: GenericGF;
    static AZTEC_DATA_8: GenericGF;
    static MAXICODE_FIELD_64: GenericGF;
    private expTable;
    private logTable;
    private zero;
    private one;
    /**
     * Create a representation of GF(size) using the given primitive polynomial.
     *
     * @param primitive irreducible polynomial whose coefficients are represented by
     *  the bits of an int, where the least-significant bit represents the constant
     *  coefficient
     * @param size the size of the field
     * @param b the factor b in the generator polynomial can be 0- or 1-based
     *  (g(x) = (x+a^b)(x+a^(b+1))...(x+a^(b+2t-1))).
     *  In most cases it should be 1, but for QR code it is 0.
     */
    constructor(primitive: number, size: number, generatorBase: number);
    getZero(): GenericGFPoly;
    getOne(): GenericGFPoly;
    /**
     * @return the monomial representing coefficient * x^degree
     */
    buildMonomial(degree: number, coefficient: number): GenericGFPoly;
    /**
     * Implements both addition and subtraction -- they are the same in GF(size).
     *
     * @return sum/difference of a and b
     */
    static addOrSubtract(a: number, b: number): number;
    /**
     * @return 2 to the power of a in GF(size)
     */
    exp(a: number): number;
    /**
     * @return base 2 log of a in GF(size)
     */
    log(a: number): number;
    /**
     * @return multiplicative inverse of a
     */
    inverse(a: number): number;
    /**
     * @return product of a and b in GF(size)
     */
    multiply(a: number, b: number): number;
    getSize(): number;
    getGeneratorBase(): number;
    toString(): string;
    equals(o: Object): boolean;
}
