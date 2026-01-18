import { createReadStream } from "node:fs";

import type { Response, NextFunction } from "express";

import { ApiError } from "@lib/Errors";
import { removeFile } from "@events/removeFile";
import { storageUrl } from "@services/supabase";
import { uploadImage } from "@services/supabase/uploadImage";
import { generateImageFilePath as gFP } from "@utils/generateImageFilePath";
import type { PostContentImageRequest } from "@types";

export const uploadPostContentImage = async (
  req: PostContentImageRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.upload) {
    const error = new ApiError("Something went wrong. Please try again later");
    return next(error);
  }

  let filepath = "";

  try {
    const { file } = req.upload;
    const { mimetype } = file;
    ({ filepath } = file);

    const fileStream = createReadStream(filepath);
    const imageFilePath = await gFP("postContentImage", mimetype, filepath);

    const { error: supabaseErr } = await uploadImage(
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

    res.status(201).set("Location", url).json({ url });
  } catch (err) {
    if (err instanceof ApiError) return next(err);

    const error = new ApiError("Something went wrong. Please try again later");
    next(error);
  } finally {
    if (filepath) removeFile.emit("remove", [filepath]);
  }
};
