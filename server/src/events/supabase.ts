import { EventEmitter } from "node:events";
import { client } from "@services/supabase";

export const supabaseEvent = new EventEmitter();

supabaseEvent.on("removeImage", (image: string) => {
  client.storage
    .from("images")
    .remove([image])
    .catch((error: unknown) => {
      // log the error for debugging purposes
      console.error("Supabase delete image error - ", error);
    });
});

supabaseEvent.on("error", (error: Error) => {
  console.error("Supabase event error - ", error);
});
