import { readFile } from "node:fs/promises";

import type { Response, NextFunction } from "express";

import supabase from "@lib/supabase/supabaseClient";
import { removeFile } from "@events/removeFile";

import { ApiError } from "@utils/Errors";
import { generateImageFilePath } from "@utils/generateImageFilePath";
import { UPLOAD_DIR } from "@utils/constants";
import { upload } from "@utils/upload";

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

  try {
    const { storageUrl } = supabase();
    const { file } = req.upload;
    const { mimetype, filepath } = file;

    const imageFile = await readFile(filepath);
    const imageFilePath = await generateImageFilePath(
      "postContentImage",
      mimetype
    );

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

    const url = `${storageUrl}${imageFilePath}`;

    res.status(201).set("Location", url).json({ url });
  } catch (err) {
    if (err instanceof ApiError) return next(err);

    const error = new ApiError("Something went wrong. Please try again later");
    next(error);
  }
};
