import { EventEmitter } from "node:events";

import supabase from "./supabaseClient";

export const supabaseEvent = new EventEmitter();

supabaseEvent.on("removeImage", (image: string) => {
  (async (imagePath: string) => {
    const { client } = supabase();
    const { error } = await client.storage.from("images").remove([imagePath]);

    if (error) console.error("Supabase delete image error - ", error);
  })(image);
});

supabaseEvent.on("error", (error: Error) => {
  console.error("Supabase event error - ", error);
});
