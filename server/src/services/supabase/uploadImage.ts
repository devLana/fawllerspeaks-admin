import type { Buffer } from "node:buffer";
import { client } from ".";

export const uploadImage = async (
  path: string,
  contentType: string,
  imageFile: Buffer
) => {
  const { error } = await client.storage
    .from("images")
    .upload(path, imageFile, { contentType });

  return { error };
};
