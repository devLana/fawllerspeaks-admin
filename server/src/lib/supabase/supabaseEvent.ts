import { EventEmitter } from "node:events";

import supabase from "./supabaseClient";

export const supabaseEvent = new EventEmitter();

supabaseEvent.on("removeImage", (imageLink: string) => {
  (async (imageUrl: string) => {
    const { client, storageUrl } = supabase();
    const regex = new RegExp(storageUrl, "i");
    const imagePath = imageUrl.replace(regex, "");

    const { error } = await client.storage.from("images").remove([imagePath]);

    if (error) console.error("Supabase delete image error - ", error);
  })(imageLink);
});

supabaseEvent.on("error", (error: Error) => {
  console.error("Supabase event error - ", error);
});
