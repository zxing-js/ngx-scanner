export default class StringEncoding {
    static decode(bytes: Uint8Array, encoding: string): string;
    static encode(s: string, encoding: string): Uint8Array;
    private static isBrowser();
    private static decodeFallBack(bytes, encoding);
    private static encodeFallBack(s, encoding);
}
