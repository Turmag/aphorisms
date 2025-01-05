export const getSecondsDiff = (d1: Date, d2: Date): number => {
    const diff = (d2.getTime() - d1.getTime()) / 1000;
    return Math.abs(Math.round(diff));
};
