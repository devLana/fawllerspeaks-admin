import { EventEmitter } from "node:events";
import { unlink } from "node:fs";

export const removeFile = new EventEmitter();

removeFile.on("remove", (filepaths: string[]) => {
  filepaths.forEach(filepath => {
    unlink(filepath, unlinkError => {
      if (unlinkError) removeFile.emit("error", unlinkError);
    });
  });
});

removeFile.on("error", (error: Error) => {
  console.error(error.message);
});
