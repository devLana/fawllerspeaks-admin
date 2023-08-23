export const generateSupabasePath = (
  category: [string, string],
  filename: string,
  mimeType: string
) => {
  const isDev = process.env.NODE_ENV === "development" ? "dev/" : "";
  const categoryPathname = `${category[0]}/${category[1]}`;
  const [, extension] = mimeType.split(/[/\\]/);
  const ext = extension ? `.${extension}` : "";

  return `${isDev}${categoryPathname}/${filename}${ext}`;
};
