import bcrypt from "bcrypt";
import { generateBytes } from "@utils/generateBytes";

export const bytesHash = async () => {
  const password = await generateBytes(10, "base64url");
  const hash = await bcrypt.hash(password, 10);

  return { hash, password };
};
