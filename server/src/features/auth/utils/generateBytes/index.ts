import crypto from "node:crypto";
import util from "node:util";

const generateBytes = async (size: number, encoding: BufferEncoding) => {
  const randomBytes = util.promisify(crypto.randomBytes);
  const buf = await randomBytes(size);

  return buf.toString(encoding);
};

export default generateBytes;
