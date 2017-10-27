export default class Exception {
    private type;
    private message;
    static IllegalArgumentException: string;
    static NotFoundException: string;
    static ArithmeticException: string;
    static FormatException: string;
    static ChecksumException: string;
    static WriterException: string;
    static IllegalStateException: string;
    static UnsupportedOperationException: string;
    static ReedSolomonException: string;
    static ArgumentException: string;
    static ReaderException: string;
    constructor(type: string, message?: string);
    getType(): string;
    getMessage(): string | undefined;
    static isOfType(ex: any, type: string): boolean;
}
