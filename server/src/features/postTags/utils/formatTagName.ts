export const formatTagName = (tagName: string) => {
  return tagName.toLowerCase().replace(/[\s_-]/g, "");
};
