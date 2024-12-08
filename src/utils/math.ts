export const clip = (
    value: number,
    min: number = -Infinity,
    max: number = Infinity,
) => Math.min(Math.max(value, min), max);

export const getNextPowerOf2 = (n: number) => 2 ** Math.ceil(Math.log2(n));
export const getPrevPowerOf2 = (n: number) => 2 ** ~~Math.log2(n);
export const isPowerOf2 = (x: number) => (x & (x - 1)) === 0;
