import type { NextApiRequest } from "next";

import formidable, { type Files, type Fields } from "formidable";

type FieldsKeys = "avatar" | "post";
type ParsedForm = [Fields<FieldsKeys>, Required<Files<"image">>];

export class ParseFormError extends Error {}

export const parseForm = (req: NextApiRequest) => {
  return new Promise<ParsedForm>((resolve, reject) => {
    const form = formidable({ maxFiles: 1 });

    form.parse<FieldsKeys, "image">(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      if (!files.image) {
        reject(new ParseFormError("No image file was uploaded"));
        return;
      }

      if (files.image.length > 1) {
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

      resolve([fields, { image: files.image }]);
    });
  });
};
