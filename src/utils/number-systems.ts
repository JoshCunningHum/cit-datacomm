type ValidValue = string | number;

const guessBase = (value: ValidValue) => {
    if (typeof value === "number") return 10;
    const digits = value.split("");

    if (digits.some((d) => /[a-f8-9]/i.test(d))) return 16;
    if (digits.some((d) => /[2-7]/i.test(d))) return 8;
    if (digits.every((d) => /[0-1]/i.test(d))) return 2;

    return -1;
};

export const dec = (value: ValidValue, base: number = guessBase(value)) =>
    typeof value === "number" ? value : parseInt(value, base);
export const bin = (value: ValidValue, base: number = guessBase(value)) =>
    dec(value, base).toString(2);
export const oct = (value: ValidValue, base: number = guessBase(value)) =>
    dec(value, base).toString(8);
export const hex = (value: ValidValue, base: number = guessBase(value)) =>
    dec(value, base).toString(16);
