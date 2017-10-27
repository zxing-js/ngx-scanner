import GenericGF from './GenericGF';
/**
 * <p>Represents a polynomial whose coefficients are elements of a GF.
 * Instances of this class are immutable.</p>
 *
 * <p>Much credit is due to William Rucklidge since portions of this code are an indirect
 * port of his C++ Reed-Solomon implementation.</p>
 *
 * @author Sean Owen
 */
export default class GenericGFPoly {
    private field;
    private coefficients;
    /**
     * @param field the {@link GenericGF} instance representing the field to use
     * to perform computations
     * @param coefficients coefficients as ints representing elements of GF(size), arranged
     * from most significant (highest-power term) coefficient to least significant
     * @throws IllegalArgumentException if argument is null or empty,
     * or if leading coefficient is 0 and this is not a
     * constant polynomial (that is, it is not the monomial "0")
     */
    constructor(field: GenericGF, coefficients: Int32Array);
    getCoefficients(): Int32Array;
    /**
     * @return degree of this polynomial
     */
    getDegree(): number;
    /**
     * @return true iff this polynomial is the monomial "0"
     */
    isZero(): boolean;
    /**
     * @return coefficient of x^degree term in this polynomial
     */
    getCoefficient(degree: number): number;
    /**
     * @return evaluation of this polynomial at a given point
     */
    evaluateAt(a: number): number;
    addOrSubtract(other: GenericGFPoly): GenericGFPoly;
    multiply(other: GenericGFPoly): GenericGFPoly;
    multiplyScalar(scalar: number): GenericGFPoly;
    multiplyByMonomial(degree: number, coefficient: number): GenericGFPoly;
    divide(other: GenericGFPoly): GenericGFPoly[];
    toString(): string;
}
