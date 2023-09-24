import type { Buffer } from "node:buffer";

import supabase from "@lib/supabase/supabaseClient";

export const upload = async (
  path: string,
  contentType: string,
  imageFile: Buffer
) => {
  const { client } = supabase();

  const { error } = await client.storage
    .from("images")
    .upload(path, imageFile, { contentType });

  return { error };
};
