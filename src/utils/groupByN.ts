export const groupByN = <T>(arr: T[], by: number) => {
    const length = Math.ceil(arr.length / by);
    const result: T[][] = Array(length)
        .fill(0)
        .map(() => []);

    arr.forEach((v, i) => {
        const ti = ~~(i / by);
        result[ti].push(v);
    });

    return result;
};
