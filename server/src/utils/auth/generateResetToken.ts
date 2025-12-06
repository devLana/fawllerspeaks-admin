import { createHash } from "node:crypto";
import generateBytes from "../generateBytes";

const generateResetToken = async () => {
  const token = await generateBytes(32, "base64url");
  const hash = createHash("sha256").update(token).digest("hex");

  return { token, hash };
};

export default generateResetToken;
