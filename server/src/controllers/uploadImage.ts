import { readFile } from "node:fs/promises";

import type { Response, NextFunction } from "express";

import supabase from "@lib/supabase/supabaseClient";
import { removeFile } from "@events/removeFile";
import { ApiError, generateSupabasePath } from "@utils";
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
    const { client, storageUrl } = supabase();
    const { file, imageCategory } = req.upload;
    const { mimetype, filepath } = file;

    const imageFile = await readFile(filepath);
    const supabaseFilePath = await generateSupabasePath(
      imageCategory,
      mimetype
    );

    const { error: supabaseErr } = await client.storage
      .from("images")
      .upload(supabaseFilePath, imageFile, { contentType: mimetype });

    removeFile.emit("remove", filepath);

    if (supabaseErr) {
      throw new ApiError(
        "Something has gone wrong and your image could not be uploaded. Please try again later"
      );
    }

    const remoteUrl = `${storageUrl}${supabaseFilePath}`;

    res
      .status(201)
      .set("Location", remoteUrl)
      .json({ image: remoteUrl, status: "SUCCESS" });
  } catch (err) {
    if (err instanceof ApiError) return next(err);

    const error = new ApiError("Something went wrong. Please try again later");
    next(error);
  }
};