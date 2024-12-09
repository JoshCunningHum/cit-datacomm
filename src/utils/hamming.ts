import { isPowerOf2 } from "./math";
import { dec } from "./number-systems";

export const getEncodedLength = (n: number) => Math.ceil(Math.log2(n)) + n + 1;
export const getRedundancyBitIndexes = (n: number) => {
    const m = getEncodedLength(n) - n;
    return Array(m)
        .fill(0)
        .map((_, i) => 2 ** i);
};

export const applyRedundancy = (str: string) => {
    const length = getEncodedLength(str.length);

    let result = Array(length).fill("_");
    for (let i = 0, j = str.length; i < length; i++) {
        const place = length - (i + 1);
        if (!isPowerOf2(i + 1)) {
            j--;
            result[place] = str[j];
        }
    }

    // Apply row checking
    const m = ~~Math.log2(length);
    for (let i = 1; i <= m + 1; i++) {
        const { results: values } = getRowBits(result.join(""), i);
        const even = values.filter((d) => d === "1").length % 2 === 0;
        result[length - 2 ** (i - 1)] = even ? "0" : "1";
    }

    return result.join("");
};

export const simulateError = (sent: string, received: string) => {
    sent = applyRedundancy(sent);
    received = applyRedundancy(received);
    console.log(sent, received);

    let result = "";
    for (let i = 1; i <= sent.length; i++) {
        const r = sent.length - i;
        console.log(r);

        if (isPowerOf2(i)) {
            result += sent[r];
        } else {
            result += received[r];
        }
    }

    return result.split("").reverse().join("");
};

export const getRowBits = (str: string, n: number) => {
    // rule: skip 2^(n-1) group 2^(n-1)
    // n starts at 1 (row 1, row 2, row 3 etc...)
    const length = str.length;
    const indexes = [];
    const results = [];

    const r = 2 ** (n - 1);

    // _i is the index when visualizing
    for (let _i = r; _i <= length; _i += r * 2) {
        const i = length - _i; // the actual index in the string

        for (let j = 0; j < r && j + i < length; j++) {
            indexes.push(_i + j);
            results.push(str[i - j]);
        }
    }

    return {
        indexes,
        results,
    };
};
