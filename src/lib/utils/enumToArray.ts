export default <
    T extends Record<string, string | number>,
    Mode extends boolean = false,
>(
    enumObj: T,
    values?: Mode,
): (Mode extends true ? T[keyof T] : keyof T)[] => {
    return Object.entries(enumObj)
        .filter(([key]) => isNaN(Number(key)))
        .map(([key, value]) => (values ? value : key)) as any;
};
