export const range = (length: number) => {
  return Array.from({ length }, (_, i) => i);
};

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);
