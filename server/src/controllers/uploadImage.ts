import { createReadStream } from "fs";

import type { Response, NextFunction } from "express";

import { ApiError } from "@lib/Errors";
import { removeFile } from "@events/removeFile";
import { storageUrl } from "@services/supabase";
import { uploadImage as upload } from "@services/supabase/uploadImage";
import { generateImageFilePath } from "@utils/generateImageFilePath";
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

  let filepath = "";

  try {
    const { file, imageCategory } = req.upload;
    const { mimetype } = file;
    ({ filepath } = file);

    const fileStream = createReadStream(filepath);
    const imageFilePath = await generateImageFilePath(imageCategory, filepath);

    const { error: supabaseErr } = await upload(
      imageFilePath,
      mimetype,
      fileStream
    );

    if (supabaseErr) {
      throw new ApiError(
        "Something has gone wrong and your image could not be uploaded. Please try again later"
      );
    }

    const url = `${storageUrl}${imageFilePath}`;

    res.status(201).set("Location", url).json({ image: imageFilePath });
  } catch (err) {
    if (err instanceof ApiError) return next(err);

    const error = new ApiError("Something went wrong. Please try again later");
    next(error);
  } finally {
    if (filepath) removeFile.emit("remove", [filepath]);
  }
};
