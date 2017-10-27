import DecodeHintType from './../DecodeHintType';
/**
 * Common string-related functions.
 *
 * @author Sean Owen
 * @author Alex Dupre
 */
export default class StringUtils {
    static SHIFT_JIS: string;
    static GB2312: string;
    private static EUC_JP;
    private static UTF8;
    private static PLATFORM_DEFAULT_ENCODING;
    private static ISO88591;
    private static ASSUME_SHIFT_JIS;
    private StringUtils();
    /**
     * @param bytes bytes encoding a string, whose encoding should be guessed
     * @param hints decode hints if applicable
     * @return name of guessed encoding; at the moment will only guess one of:
     *  {@link #SHIFT_JIS}, {@link #UTF8}, {@link #ISO88591}, or the platform
     *  default encoding if none of these can possibly be correct
     */
    static guessEncoding(bytes: Uint8Array, hints: Map<DecodeHintType, any>): string;
}
