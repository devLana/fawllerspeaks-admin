import formidable from "formidable";
import type { Response, NextFunction } from "express";

import { removeFile } from "@events/removeFile";
import { ApiError, BadRequestError } from "@utils/Errors";
import { UPLOAD_DIR } from "@utils/constants";
import type { PostContentImageRequest } from "@types";

export const postContentImageParser = async (
  req: PostContentImageRequest,
  _: Response,
  next: NextFunction
) => {
  if (!req.headers["content-type"]?.includes("multipart/form-data")) {
    const error = new BadRequestError("Invalid request type");
    return next(error);
  }

  try {
    const form = formidable({ uploadDir: UPLOAD_DIR });
    const [, files] = await form.parse(req);

    if (!files.upload || files.upload.length === 0) {
      throw new BadRequestError("No image file was uploaded");
    }

    if (files.upload.length > 1) {
      throw new BadRequestError("Only one image file can be uploaded");
    }

    if (!files.upload[0].mimetype?.startsWith("image/")) {
      throw new BadRequestError("Only an image file can be uploaded");
    }

    const [{ filepath, mimetype }] = files.upload;

    const file = { filepath, mimetype };
    const uploadReq = req;

    uploadReq.upload = { file };

    next();
  } catch (err) {
    removeFile.emit("remove", UPLOAD_DIR);

    if (err instanceof ApiError) return next(err);

    const error = new ApiError(
      "There was an error processing your image upload. Please try again later"
    );

    next(error);
  }
};
