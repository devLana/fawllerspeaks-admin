import formidable from "formidable";
import type { Response, NextFunction } from "express";

import { removeFile } from "@events/removeFile";
import { ApiError, BadRequestError } from "@lib/Errors";
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

  let imageFilepaths: string[] = [];
  let otherImageFilepaths: string[] = [];

  try {
    const form = formidable({
      allowEmptyFiles: false,
      keepExtensions: true,
      filter: ({ mimetype }) => !!mimetype?.startsWith("image/"),
    });

    const [fields, files] = await form.parse<"type", "image">(req);

    Object.entries(files).forEach(([key, fileItems]) => {
      if (key === "image") {
        imageFilepaths = fileItems.map(file => file.filepath);
        return;
      }

      otherImageFilepaths = fileItems.map(file => file.filepath);
    });

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
    if (imageFilepaths.length > 0) removeFile.emit("remove", imageFilepaths);

    if (err instanceof ApiError) return next(err);

    const error = new ApiError(
      "There was an error processing your image upload. Please try again later"
    );

    next(error);
  } finally {
    if (otherImageFilepaths.length > 0) {
      removeFile.emit("remove", otherImageFilepaths);
    }
  }
};
