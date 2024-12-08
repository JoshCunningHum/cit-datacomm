import { IP, ipformat, sections } from "./ip";
import { isPowerOf2, getNextPowerOf2, clip } from "./math";
import { bin, dec } from "./number-systems";

export class SubnetMask {
    static fromRange(n: number) {
        if (!isPowerOf2(n)) n = getNextPowerOf2(n);
        const b = bin(n - 1);
        return this.fromSlash(32 - b.length);
    }

    static from(str: string) {
        return new SubnetMask(str);
    }

    static fromSlash(n: number) {
        const sections = Array(4).fill(0);
        const formatter = (_: any, i: number) =>
            dec("1".repeat(clip(n - i * 8, 0, 8)).padEnd(8, "0"));

        return new SubnetMask(ipformat(sections.map(formatter)));
    }
    private _slash: number = 0;
    private _range: number = 0;
    private _sects: number[] = [];
    private _i?: number;

    private _value: string = "";
    get value() {
        return this._value;
    }
    set value(str: string) {
        this._value = str;

        const sects = sections(str);
        this._sects = sects;

        // update inherent values
        const i = sects.findIndex((n) => n < 255);
        this._i = i;
        if (i === -1) this._i = undefined;

        this._slash = this.value
            .split(".")
            .map((d) => bin(d, 10).padStart(8, "0"))
            .join("")
            .split("")
            .filter((d) => d === "1").length;

        this._range = i !== undefined ? 2 ** (32 - this._slash) : 0;
    }

    constructor(str: string) {
        this.value = str;
    }

    get slash() {
        return this._slash;
    }
    set slash(n: number) {
        this._slash = n;
        const m = SubnetMask.fromSlash(this.slash);
        this.value = m.value;
    }

    get range() {
        return this._range;
    }

    get sects() {
        return this._sects;
    }

    apply(ip: string) {
        const { sects: mask_s } = this;
        const ip_s = sections(ip);
        const applied = ip_s.map((ip, i) => mask_s[i] & ip);

        return new IP(ipformat(applied));
    }
}
