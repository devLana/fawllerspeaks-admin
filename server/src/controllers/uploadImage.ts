import { createReadStream } from "fs";

import type { Response, NextFunction } from "express";

import { ApiError } from "@lib/Errors";
import { removeFile } from "@events/removeFile";
import { storageUrl } from "@services/supabase";
import { uploadImage as upload } from "@services/supabase/uploadImage";
import { generateImageFilePath as gfp } from "@utils/generateImageFilePath";
import type { ImageUploadRequest } from "@appTypes";

export const uploadImage = (
  req: ImageUploadRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.upload) {
    const error = new ApiError("Something went wrong. Please try again later");
    next(error);
    return;
  }

  (async (file, imageCategory) => {
    const { mimetype, filepath } = file;

    try {
      const fileStream = createReadStream(filepath);
      const imageFilePath = await gfp(imageCategory, mimetype, filepath);

      const { error: supabaseErr } = await upload(
        imageFilePath,
        mimetype,
        fileStream,
      );

      if (supabaseErr) {
        throw new ApiError(
          "Something has gone wrong and your image could not be uploaded. Please try again later",
        );
      }

      const url = `${storageUrl}${imageFilePath}`;

      res.status(201).set("Location", url).json({ image: imageFilePath });
    } catch (err) {
      if (err instanceof ApiError) {
        next(err);
        return;
      }

      next(new ApiError("Something went wrong. Please try again later"));
    } finally {
      if (filepath) removeFile.emit("remove", [filepath]);
    }
  })(req.upload.file, req.upload.imageCategory);
};
