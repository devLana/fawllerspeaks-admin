import crypto from "node:crypto";
import util from "node:util";

import { nodeEnv } from "./nodeEnv";

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

export const generateSupabasePath = async (
  imageCategory: string,
  mimeType: string
) => {
  const randomBytes = util.promisify(crypto.randomBytes);

  const filenameBuf = await randomBytes(25);
  const filename = filenameBuf.toString("base64url");
  const isDev = nodeEnv === "development" ? "dev/" : "";
  const extension = mimeTypeDict[mimeType] ?? "";

  return `${isDev}${imageCategory}/${filename}${extension}`;
};
