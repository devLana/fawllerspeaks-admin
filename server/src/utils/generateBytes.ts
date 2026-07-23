import crypto from "node:crypto";

export const generateBytes = async (size: number, encoding: BufferEncoding) => {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(size, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf.toString(encoding));
      }
    });
  });
};
