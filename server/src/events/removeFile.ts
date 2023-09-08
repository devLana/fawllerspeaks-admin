import { EventEmitter } from "node:events";
import { stat, unlink } from "node:fs";

export const removeFile = new EventEmitter();

removeFile.on("remove", (filepath: string) => {
  stat(filepath, err => {
    if (err) {
      removeFile.emit("error", err);
    } else {
      unlink(filepath, error => {
        if (error) removeFile.emit("error", error);
      });
    }
  });
});

removeFile.on("error", (error: Error) => {
  console.error(error.message);
});
