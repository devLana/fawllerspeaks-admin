import crypto from "node:crypto";
import util from "node:util";

import { nodeEnv } from "../nodeEnv";
import type { ImageCategory } from "@types";

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

export const generateImageFilePath = async (
  imageCategory: ImageCategory,
  mimeType: string
) => {
  const randomBytes = util.promisify(crypto.randomBytes);
  const filenameBuf = await randomBytes(25);
  const filename = filenameBuf.toString("base64url");
  const extension = mimeTypeDict[mimeType] ?? "";
  let pathname: string;
  let folderName: string;

  switch (nodeEnv) {
    case "development":
      pathname = "dev/";
      break;
    case "demo":
      pathname = "demo/";
      break;
    case "production":
      pathname = "files/";
      break;
    case "test":
    default:
      pathname = "misc/";
  }

  switch (imageCategory) {
    case "avatar":
      folderName = "avatar/";
      break;

    case "postBanner":
      folderName = "post/banner/";
      break;

    case "postContentImage":
      folderName = "post/content-image/";
      break;

    default:
      folderName = "";
  }

  return `${pathname}${folderName}${filename}${extension}`;
};
