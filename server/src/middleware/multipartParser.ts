import formidable from "formidable";
import type { Response, NextFunction } from "express";

import { removeFile } from "@events/removeFile";
import { ApiError, BadRequestError, UPLOAD_DIR } from "@utils";
import type { UploadRequest } from "@types";

export const multipartParser = async (
  req: UploadRequest,
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

    if (!files.image) {
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

    if (fields.type[0] !== "avatar" && fields.type[0] !== "post") {
      throw new BadRequestError(
        "Image category type must be 'avatar' or 'post'"
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
      "There was an error parsing your request. Please try again later"
    );
    next(error);
  }
};
