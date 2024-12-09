import { groupByN } from "./groupByN";
import { bin, dec } from "./number-systems";

export const binToAscii = (str: string, asciiBits = 8) => {
    const grouped = groupByN(str.split(""), asciiBits).map((s) =>
        dec(s.join(""), 2),
    );

    return String.fromCharCode(...grouped);
};

export const asciiToBin = (str: string, asciiBits = 8) => {
    const binary = str
        .split("")
        .map((d) => bin(d.charCodeAt(0), 10).padStart(asciiBits, "0"));
    return binary.join("");
};
