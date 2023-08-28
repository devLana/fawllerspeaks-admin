import type { NextApiRequest } from "next";

import formidable, { type File } from "formidable";

interface Fields {
  avatar?: string[];
  post?: string[];
}

interface Files {
  image?: File[];
}

type ParsedForm = [Fields, Required<Files>];

export class ParseFormError extends Error {}

export const parseForm = async (req: NextApiRequest) => {
  return new Promise<ParsedForm>((resolve, reject) => {
    const form = formidable({ maxFiles: 1 });

    form.parse(req, (err, fields: Fields, files: Files) => {
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
