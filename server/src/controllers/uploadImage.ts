import { readFile } from "node:fs/promises";

import type { Response, NextFunction } from "express";

import supabase from "@lib/supabase/supabaseClient";
import { removeFile } from "@events/removeFile";
import { ApiError, generateSupabasePath, upload, UPLOAD_DIR } from "@utils";
import type { UploadRequest } from "@types";

export const uploadImage = async (
  req: UploadRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.upload) {
    const error = new ApiError("Something went wrong. Please try again later");
    return next(error);
  }

  try {
    const { storageUrl } = supabase();
    const { file, imageCategory } = req.upload;
    const { mimetype, filepath } = file;

    const imageFile = await readFile(filepath);
    const supabaseFilePath = await generateSupabasePath(
      imageCategory,
      mimetype
    );

    const { error: supabaseErr } = await upload(
      supabaseFilePath,
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
      .set("Location", `${storageUrl}${supabaseFilePath}`)
      .json({ image: supabaseFilePath, status: "SUCCESS" });
  } catch (err) {
    if (err instanceof ApiError) return next(err);

    const error = new ApiError("Something went wrong. Please try again later");
    next(error);
  }
};
