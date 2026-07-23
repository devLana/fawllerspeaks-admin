import formidable from "formidable";
import type { Response, NextFunction } from "express";

import { removeFile } from "@events/removeFile";
import { ApiError, BadRequestError } from "@lib/Errors";
import type { PostContentImageRequest } from "@appTypes";

export const postContentImageParser = (
  req: PostContentImageRequest,
  _: Response,
  next: NextFunction,
) => {
  if (!req.headers["content-type"]?.includes("multipart/form-data")) {
    const error = new BadRequestError("Invalid request type");
    next(error);
    return;
  }

  (async () => {
    let imageFilepaths: string[] = [];
    let otherImageFilepaths: string[] = [];

    try {
      const form = formidable({
        allowEmptyFiles: false,
        keepExtensions: true,
        filter: ({ mimetype }) => !!mimetype?.startsWith("image/"),
      });

      const [, files] = await form.parse<never, "upload">(req);

      Object.entries(files).forEach(([key, fileItems]) => {
        if (key === "upload") {
          imageFilepaths = fileItems.map(file => file.filepath);
          return;
        }

        otherImageFilepaths = fileItems.map(file => file.filepath);
      });

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
      if (imageFilepaths.length > 0) removeFile.emit("remove", imageFilepaths);

      if (err instanceof ApiError) {
        next(err);
        return;
      }

      const error = new ApiError(
        "There was an error processing your image upload. Please try again later",
      );

      next(error);
    } finally {
      if (otherImageFilepaths.length > 0) {
        removeFile.emit("remove", otherImageFilepaths);
      }
    }
  })();
};
