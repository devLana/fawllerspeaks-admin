export const formatText = (tagsLength: number) => {
  if (tagsLength === 1) return "post tag?";

  if (tagsLength - 1 > 1) return `and ${tagsLength - 1} other post tags?`;

  return `and ${tagsLength - 1} other post tag?`;
};
