import { createHash } from "node:crypto";
import generateBytes from "../generateBytes";

export const generateResetHash = (token: string) => {
  return createHash("sha256").update(token).digest("hex");
};

const generateResetToken = async () => {
  const token = await generateBytes(32, "base64url");
  const hash = generateResetHash(token);

  return { token, hash };
};

export default generateResetToken;
