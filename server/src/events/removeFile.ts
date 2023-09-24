import { EventEmitter } from "node:events";
import { stat, unlink, readdir } from "node:fs";

export const removeFile = new EventEmitter();

removeFile.on("remove", (directory: string) => {
  stat(directory, statErr => {
    if (statErr) {
      removeFile.emit("error", statErr);
      return;
    }

    readdir(directory, (readdirErr, files) => {
      if (readdirErr) {
        removeFile.emit("error", readdirErr);
        return;
      }

      files.forEach(file => {
        unlink(`${directory}\\${file}`, unlinkError => {
          if (unlinkError) removeFile.emit("error", unlinkError);
        });
      });
    });
  });
});

removeFile.on("error", (error: Error) => {
  console.error(error.message);
});
