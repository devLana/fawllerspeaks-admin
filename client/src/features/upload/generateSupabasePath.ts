const mimeTypeDict: Record<string, string | undefined> = {
  "image/avif": ".avif",
  "image/bmp": ".bmp",
  "image/gif": ".gif",
  "image/vnd.microsoft.icon": ".ico",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/svg+xml": ".svg",
  "image/tiff": ".tif",
  "image/webp": ".webp",
};

export const generateSupabasePath = (
  category: [string, string],
  filename: string,
  mimeType: string
) => {
  const isDev = process.env.NODE_ENV === "development" ? "dev/" : "";
  const categoryPathname = `${category[0]}/${category[1]}`;
  const extension = mimeTypeDict[mimeType] ?? "";

  return `${isDev}${categoryPathname}/${filename}${extension}`;
};
