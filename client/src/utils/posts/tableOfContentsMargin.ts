export const tableOfContentsMargin = (level: number) => {
  if (level === 3) return 3 / 2;
  if (level === 4) return 4 / 2 + 0.8;
  if (level === 5) return 5 / 2 + 1.6;
  return 0;
};
