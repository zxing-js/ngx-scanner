export declare const enum CharacterSetValueIdentifiers {
    Cp437 = 0,
    ISO8859_1 = 1,
    ISO8859_2 = 2,
    ISO8859_3 = 3,
    ISO8859_4 = 4,
    ISO8859_5 = 5,
    ISO8859_6 = 6,
    ISO8859_7 = 7,
    ISO8859_8 = 8,
    ISO8859_9 = 9,
    ISO8859_10 = 10,
    ISO8859_11 = 11,
    ISO8859_13 = 12,
    ISO8859_14 = 13,
    ISO8859_15 = 14,
    ISO8859_16 = 15,
    SJIS = 16,
    Cp1250 = 17,
    Cp1251 = 18,
    Cp1252 = 19,
    Cp1256 = 20,
    UnicodeBigUnmarked = 21,
    UTF8 = 22,
    ASCII = 23,
    Big5 = 24,
    GB18030 = 25,
    EUC_KR = 26,
}
/**
 * Encapsulates a Character Set ECI, according to "Extended Channel Interpretations" 5.3.1.1
 * of ISO 18004.
 *
 * @author Sean Owen
 */
export default class CharacterSetECI {
    valueIdentifier: CharacterSetValueIdentifiers;
    name: string;
    private static VALUE_IDENTIFIER_TO_ECI;
    private static VALUES_TO_ECI;
    private static NAME_TO_ECI;
    static Cp437: CharacterSetECI;
    static ISO8859_1: CharacterSetECI;
    static ISO8859_2: CharacterSetECI;
    static ISO8859_3: CharacterSetECI;
    static ISO8859_4: CharacterSetECI;
    static ISO8859_5: CharacterSetECI;
    static ISO8859_6: CharacterSetECI;
    static ISO8859_7: CharacterSetECI;
    static ISO8859_8: CharacterSetECI;
    static ISO8859_9: CharacterSetECI;
    static ISO8859_10: CharacterSetECI;
    static ISO8859_11: CharacterSetECI;
    static ISO8859_13: CharacterSetECI;
    static ISO8859_14: CharacterSetECI;
    static ISO8859_15: CharacterSetECI;
    static ISO8859_16: CharacterSetECI;
    static SJIS: CharacterSetECI;
    static Cp1250: CharacterSetECI;
    static Cp1251: CharacterSetECI;
    static Cp1252: CharacterSetECI;
    static Cp1256: CharacterSetECI;
    static UnicodeBigUnmarked: CharacterSetECI;
    static UTF8: CharacterSetECI;
    static ASCII: CharacterSetECI;
    static Big5: CharacterSetECI;
    static GB18030: CharacterSetECI;
    static EUC_KR: CharacterSetECI;
    values: Int32Array;
    otherEncodingNames: string[];
    constructor(valueIdentifier: CharacterSetValueIdentifiers, valuesParam: Int32Array | number, name: string, ...otherEncodingNames: string[]);
    getValueIdentifier(): CharacterSetValueIdentifiers;
    getName(): string;
    getValue(): number;
    /**
     * @param value character set ECI value
     * @return {@code CharacterSetECI} representing ECI of given value, or null if it is legal but
     *   unsupported
     * @throws FormatException if ECI value is invalid
     */
    static getCharacterSetECIByValue(value: number): CharacterSetECI;
    /**
     * @param name character set ECI encoding name
     * @return CharacterSetECI representing ECI for character encoding, or null if it is legal
     *   but unsupported
     */
    static getCharacterSetECIByName(name: string): CharacterSetECI;
    equals(o: CharacterSetECI): boolean;
}
