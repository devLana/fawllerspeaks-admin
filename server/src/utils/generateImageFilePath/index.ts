import { env } from "@lib/env";
import generateBytes from "@utils/generateBytes";
import type { ImageCategory } from "@types";

export const generateImageFilePath = async (
  imageCategory: ImageCategory,
  filepath: string
) => {
  const filename = await generateBytes(20, "base64url");
  const extension = `.${filepath.split(".").pop()}`;
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
