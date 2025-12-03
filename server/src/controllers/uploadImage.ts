import { readFile } from "node:fs/promises";

import type { Response, NextFunction } from "express";

import { storageUrl } from "@services/supabase";
import { removeFile } from "@events/removeFile";

import { ApiError } from "@lib/Errors";
import { generateImageFilePath } from "@utils/generateImageFilePath";
import { UPLOAD_DIR } from "@utils/constants";
import { uploadImage as upload } from "@services/supabase/uploadImage";

import type { ImageUploadRequest } from "@types";

export const uploadImage = async (
  req: ImageUploadRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.upload) {
    const error = new ApiError("Something went wrong. Please try again later");
    return next(error);
  }

  try {
    const { file, imageCategory } = req.upload;
    const { mimetype, filepath } = file;

    const imageFile = await readFile(filepath);
    const imageFilePath = await generateImageFilePath(imageCategory, mimetype);

    const { error: supabaseErr } = await upload(
      imageFilePath,
      mimetype,
      imageFile
    );

    removeFile.emit("remove", UPLOAD_DIR);

    if (supabaseErr) {
      throw new ApiError(
        "Something has gone wrong and your image could not be uploaded. Please try again later"
      );
    }

    res
      .status(201)
      .set("Location", `${storageUrl}${imageFilePath}`)
      .json({ image: imageFilePath });
  } catch (err) {
    if (err instanceof ApiError) return next(err);

    const error = new ApiError("Something went wrong. Please try again later");
    next(error);
  }
};
