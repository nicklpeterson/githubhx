export const insert = <T>(array: T[], index: number, elements: T[]) =>
  array.splice(index, 0, ...elements);

export const indexArray = (from: number, to: number) => {
  const length = to - from;
  return Array.from({ length }, (_, i) => i + from);
};
