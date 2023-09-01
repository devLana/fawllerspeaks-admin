import type { NextApiRequest } from "next";

import formidable, { type File } from "formidable";

export class ParseFormError extends Error {}

export const parseForm = (req: NextApiRequest) => {
  return new Promise<[string, File]>((resolve, reject) => {
    const form = formidable({ maxFiles: 1 });

    form.parse<"type", "image">(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      if (!files.image) {
        reject(new ParseFormError("No image file was uploaded"));
        return;
      }

      if (files.image.length > 1) {
        reject(new ParseFormError("Only one image file can be uploaded"));
        return;
      }

      if (!fields.type) {
        reject(new ParseFormError("Image category type was not provided"));
        return;
      }

      if (fields.type.length > 1) {
        reject(
          new ParseFormError("Only one image category type should be provided")
        );
        return;
      }

      if (fields.type[0] !== "avatar" && fields.type[0] !== "post") {
        reject(
          new ParseFormError("Image category type must be 'avatar' or 'post'")
        );
        return;
      }

      resolve([fields.type[0], files.image[0]]);
    });
  });
};
