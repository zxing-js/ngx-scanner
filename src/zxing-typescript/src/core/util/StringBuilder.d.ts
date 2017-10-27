export default class StringBuilder {
    private value;
    constructor(value?: string);
    append(s: string): StringBuilder;
    length(): number;
    charAt(n: number): string;
    deleteCharAt(n: number): void;
    setCharAt(n: number, c: string): void;
    toString(): string;
}
