/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import type { NextApiRequest } from "next";

import formidable, { type Fields, type Files } from "formidable";

export class ParseFormError extends Error {}

export const parseForm = (req: NextApiRequest) => {
  return new Promise<[Fields, Files]>((resolve, reject) => {
    const form = formidable({ maxFiles: 1 });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      if (!files.image) {
        reject(new ParseFormError("No image file was uploaded"));
        return;
      }

      if (files.image && files.image.length > 1) {
        reject(
          new ParseFormError("Only one image file can be uploaded per request")
        );
        return;
      }

      if (!fields.avatar && !fields.post) {
        reject(new ParseFormError("Image category was not provided"));
        return;
      }

      if (fields.avatar && fields.post) {
        reject(
          new ParseFormError(
            "Only one image category type should be provided per request"
          )
        );
        return;
      }

      if (
        (fields.avatar && fields.avatar.length > 1) ||
        (fields.post && fields.post.length > 1)
      ) {
        reject(
          new ParseFormError(
            "Only one image category id should be provided per request"
          )
        );
        return;
      }

      resolve([fields, files]);
    });
  });
};
