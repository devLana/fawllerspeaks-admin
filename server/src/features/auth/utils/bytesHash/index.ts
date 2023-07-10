import bcrypt from "bcrypt";

import generateBytes from "../generateBytes";
import { DEFAULT_BYTE_SIZE } from "../constants";

const bytesHash = async () => {
  const password = await generateBytes(DEFAULT_BYTE_SIZE, "base64url");
  const hash = await bcrypt.hash(password, 10);

  return { hash, password };
};

export default bytesHash;
