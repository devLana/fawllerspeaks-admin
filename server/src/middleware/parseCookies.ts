import { createDecipheriv } from "node:crypto";

import type { Response, NextFunction } from "express";

import { env } from "@lib/env";
import type { Cookies, GQLRequest } from "@types";

export const parseCookies = (
  req: GQLRequest,
  _: Response,
  next: NextFunction
) => {
  if (!req.headers.cookie) {
    const cookieReq = req;
    cookieReq.cookies = {};
    return next();
  }

  const algorithm = env.CIPHER_ALGORITHM;
  const key = new Uint8Array(Buffer.from(env.CIPHER_KEY, "hex"));
  const iv = new Uint8Array(Buffer.from(env.CIPHER_IV, "hex"));
  const cookies = req.headers.cookie.split(/;\s?/);
  const parsedCookies: Cookies = {};

  for (const cookie of cookies) {
    const [name, value] = cookie.split(/=/);

    if (name === "auth" || name === "sig" || name === "token") {
      try {
        const decipher = createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(value, "hex", "utf-8");

        decrypted += decipher.final("utf-8");
        parsedCookies[name] = decrypted;
        continue;
      } catch {
        continue;
      }
    }

    parsedCookies[name] = value;
  }

  const cookieReq = req;
  cookieReq.cookies = parsedCookies;

  next();
};
