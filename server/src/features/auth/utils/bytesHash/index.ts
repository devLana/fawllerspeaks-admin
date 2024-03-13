import bcrypt from "bcrypt";

import generateBytes from "../generateBytes";

const bytesHash = async () => {
  const password = await generateBytes(10, "base64url");
  const hash = await bcrypt.hash(password, 10);

  return { hash, password };
};

export default bytesHash;
