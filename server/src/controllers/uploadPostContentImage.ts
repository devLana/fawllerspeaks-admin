import { createReadStream } from "node:fs";

import type { Response, NextFunction } from "express";

import { ApiError } from "@lib/Errors";
import { removeFile } from "@events/removeFile";
import { storageUrl } from "@services/supabase";
import { uploadImage } from "@services/supabase/uploadImage";
import { generateImageFilePath as gFP } from "@utils/generateImageFilePath";
import type { PostContentImageRequest } from "@appTypes";

export const uploadPostContentImage = (
  req: PostContentImageRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.upload) {
    const error = new ApiError("Something went wrong. Please try again later");
    next(error);
    return;
  }

  (async (mimetype, filepath) => {
    try {
      const fileStream = createReadStream(filepath);
      const imageFilePath = await gFP("postContentImage", mimetype, filepath);

      const { error: supabaseErr } = await uploadImage(
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

      res.status(201).set("Location", url).json({ url });
    } catch (err) {
      if (err instanceof ApiError) {
        next(err);
        return;
      }

      next(new ApiError("Something went wrong. Please try again later"));
    } finally {
      if (filepath) removeFile.emit("remove", [filepath]);
    }
  })(req.upload.file.mimetype, req.upload.file.filepath);
};
