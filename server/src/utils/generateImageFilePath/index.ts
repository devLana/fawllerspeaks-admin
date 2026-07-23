import path from "path";

import { env } from "@lib/env";
import { generateBytes } from "@utils/generateBytes";
import type { ImageCategory } from "@appTypes";

const mimetypeToExtension: Record<string, string> = {
  "image/avif": ".avif",
  "image/bmp": ".bmp",
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/svg+xml": ".svg",
  "image/tiff": ".tiff",
  "image/webp": ".webp",
};

const getExtension = (filepath: string, mimetype: string): string => {
  const ext = path.extname(filepath).toLowerCase();

  if (ext && mimetypeToExtension[mimetype] === ext) return ext;

  return mimetypeToExtension[mimetype] || ".jpg";
};

export const generateImageFilePath = async (
  imageCategory: ImageCategory,
  mimetype: string,
  filepath: string,
) => {
  const extension = getExtension(filepath, mimetype);
  const filename = await generateBytes(20, "base64url");
  let pathname: string;
  let folderName: string;

  switch (env.NAME) {
    case "development":
    case "demo":
      pathname = "dev/";
      break;
    case "test":
    default:
      pathname = "misc/";
      break;
    case "production":
      pathname = "files/";
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
