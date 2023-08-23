import { EventEmitter } from "node:events";
import { stat, unlink } from "node:fs";

export const upload = new EventEmitter();

upload.on("removeFile", (filepath: string) => {
  stat(filepath, err => {
    if (err) {
      upload.emit("error", err);
    } else {
      unlink(filepath, error => {
        if (error) upload.emit("error", error);
      });
    }
  });
});

upload.on("error", (error: Error) => {
  console.error(error.message);
});
