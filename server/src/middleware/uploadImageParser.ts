import formidable from "formidable";
import type { Response, NextFunction } from "express";

import { removeFile } from "@events/removeFile";
import { ApiError, BadRequestError } from "@utils/Errors";
import { UPLOAD_DIR } from "@utils/constants";
import type { ImageUploadRequest } from "@types";

export const uploadImageParser = async (
  req: ImageUploadRequest,
  _: Response,
  next: NextFunction
) => {
  if (!req.headers["content-type"]?.includes("multipart/form-data")) {
    const error = new BadRequestError("Invalid request type");
    return next(error);
  }

  try {
    const form = formidable({ uploadDir: UPLOAD_DIR });
    const [fields, files] = await form.parse<"type", "image">(req);

    if (!files.image || files.image.length === 0) {
      throw new BadRequestError("No image file was uploaded");
    }

    if (files.image.length > 1) {
      throw new BadRequestError("Only one image file can be uploaded");
    }

    if (!files.image[0].mimetype?.startsWith("image/")) {
      throw new BadRequestError("Only an image file can be uploaded");
    }

    if (!fields.type) {
      throw new BadRequestError("Image category type was not provided");
    }

    if (fields.type.length > 1) {
      throw new BadRequestError(
        "Only one image category type should be provided"
      );
    }

    if (fields.type[0] !== "avatar" && fields.type[0] !== "postBanner") {
      throw new BadRequestError(
        "Image category type must be 'avatar' or 'postBanner'"
      );
    }

    const [{ filepath, mimetype }] = files.image;

    const file = { filepath, mimetype };
    const uploadReq = req;

    uploadReq.upload = { file, imageCategory: fields.type[0] };

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
