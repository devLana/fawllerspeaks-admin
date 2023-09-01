import { readFile } from "node:fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";

import { supabase, storageUrl } from "@lib/supabaseClient";
import { generateSupabasePath } from "@features/upload/generateSupabasePath";
import { upload } from "@features/upload/uploadEvent";
import { parseForm, ParseFormError } from "@features/upload/parseForm";

export const config = {
  api: { bodyParser: false },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res
      .status(405)
      .setHeader("Allow", "POST")
      .send("Request method not allowed");
  } else {
    if (!req.headers["content-type"]?.includes("multipart/form-data")) {
      res.status(400).send("Request is of an invalid type");
      return;
    }

    try {
      const [imageCategory, file] = await parseForm(req);
      const { mimetype, filepath } = file;
      const supabaseFilePath = await generateSupabasePath(
        imageCategory,
        mimetype ?? ""
      );

      const imageFile = await readFile(filepath);
      const { error: err } = await supabase.storage
        .from("images")
        .upload(supabaseFilePath, imageFile, {
          contentType: mimetype ?? undefined,
        });

      upload.emit("removeFile", filepath);

      if (err) {
        res.status(500).send("Image could not be uploaded");
        return;
      }

      const remoteUrl = `${storageUrl}${supabaseFilePath}`;

      res.status(201).setHeader("Location", remoteUrl).send(remoteUrl);
    } catch (err) {
      if (err instanceof ParseFormError) {
        res.status(400).send(err.message);
      } else {
        res
          .status(500)
          .send(
            "Something went wrong and image could not be uploaded. Please try again later"
          );
      }
    }
  }
};

export default handler;
