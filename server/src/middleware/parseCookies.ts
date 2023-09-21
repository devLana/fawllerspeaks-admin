import { createDecipheriv } from "node:crypto";

import type { Response, NextFunction } from "express";

import type { GQLRequest } from "@types";

export const parseCookies = (
  req: GQLRequest,
  _: Response,
  next: NextFunction
) => {
  if (
    !process.env.CIPHER_ALGORITHM ||
    !process.env.CIPHER_KEY ||
    !process.env.CIPHER_IV ||
    !req.headers.cookie
  ) {
    const cookieReq = req;
    cookieReq.cookies = {};
    return next();
  }

  const algorithm = process.env.CIPHER_ALGORITHM;
  const key = Buffer.from(process.env.CIPHER_KEY, "hex");
  const iv = Buffer.from(process.env.CIPHER_IV, "hex");

  try {
    const cookies = req.headers.cookie.split(/;\s?/);
    const parsedCookies: Record<string, unknown> = {};

    for (const cookie of cookies) {
      const [name, value] = cookie.split(/=/);

      if (name === "auth" || name === "sig" || name === "token") {
        const decipher = createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(value, "hex", "utf-8");

        decrypted += decipher.final("utf-8");
        parsedCookies[name] = decrypted;

        continue;
      }

      parsedCookies[name] = value;
    }

    const cookieReq = req;
    cookieReq.cookies = parsedCookies;

    next();
  } catch {
    const cookieReq = req;
    cookieReq.cookies = {};
    return next();
  }
};
