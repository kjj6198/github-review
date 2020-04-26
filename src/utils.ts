export function buildScale(min: number, max: number) {
  return function (range: { min: number; max: number }) {
    return function scale(value: number) {
      return (
        (((range.max - range.min) / (max - min)) * value) /
        (range.max - range.min)
      );
    };
  };
}

export function findMinMax(nums: number[]) {
  return {
    max: Math.max(...nums),
    min: Math.min(...nums),
  };
}
