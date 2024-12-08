import { nextTick } from "vue";
import { bin, dec } from "./number-systems";
import { groupByN } from "./groupByN";

export const sections = (ip: string) => ip.split(".").map((d) => Number(d));
export const ipformat = (sects: number[]) => sects.join(".");

const ipmaskHelper = (ip: string, mask: string) => {
    const ip_s = sections(ip);
    const mask_s = sections(mask);

    const slash = mask_s
        .flatMap((d) => bin(d, 10).split(""))
        .filter((d) => d === "1").length;

    const masked_ip = ip_s.map((ip, i) => mask_s[i] & ip);

    const lss = mask_s.findIndex((n) => n < 255);

    return {
        ip_s,
        mask_s,
        lss: lss === -1 ? undefined : lss,
        masked_ip,
        slash,
    };
};

export const getStartIp = (ip: string, mask: string) => {
    const { masked_ip } = ipmaskHelper(ip, mask);
};

export const getIPRange = (ip: string, mask: string) => {
    const { slash, lss, masked_ip } = ipmaskHelper(ip, mask);
    if (!lss) return [ip]; // mask is 255.255.255.255
};

const MAX_VALUE = 4294967296;

export class IP {
    static from(str: string) {
        return new IP(str);
    }

    static fromN(n: number) {
        const b = bin(n, 10).padStart(32, "0").split("");
        const ip = groupByN(b, 8)
            .map((s) => dec(s.join(""), 2))
            .join(".");

        return new IP(ip);
    }

    static isValid(str: string) {
        const sects = sections(str);
        if (sects.length !== 4) return false;
        if (sects.some((d) => d < 0 || d > 255)) return false;

        return true;
    }

    private _value: string = "";

    get value() {
        return this._value;
    }
    set value(str: string) {
        this._value = str;
    }

    constructor(str: string) {
        this.value = str;
    }

    get N() {
        let n = 0;

        const b = sections(this.value)
            .map((n) => bin(n, 10).padStart(8, "0"))
            .join("");

        for (let i = 0; i < b.length; i++) {
            const r = 2 ** i;
            const place = b.length - (i + 1);
            if (b[place] === "1") n += r;
        }

        return n;
    }

    next(jump: number = 1) {
        const { N } = this;
        return IP.fromN((N + jump) % MAX_VALUE);
    }

    add(jump: number = 1) {
        this.value = this.next(jump).value;
    }
}
