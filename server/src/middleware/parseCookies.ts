import { createDecipheriv } from "node:crypto";

import type { Response, NextFunction } from "express";

import { ApiError } from "@utils";
import type { GQLRequest } from "@types";

export const parseCookies = (
  req: GQLRequest,
  _: Response,
  next: NextFunction
) => {
  if (
    !process.env.CIPHER_ALGORITHM ||
    !process.env.CIPHER_KEY ||
    !process.env.CIPHER_IV
  ) {
    const error = new ApiError("Sever error. Please try again later");
    return next(error);
  }

  if (!req.headers.cookie) {
    const cookieReq = req;
    cookieReq.cookies = {};
    return next();
  }

  const algorithm = process.env.CIPHER_ALGORITHM;
  const key = Buffer.from(process.env.CIPHER_KEY, "hex");
  const iv = Buffer.from(process.env.CIPHER_IV, "hex");

  try {
    const splitCookies = req.headers.cookie.split(/;\s?/).map(cookie => {
      const splitCookie = cookie.split(/=/);
      const [name] = splitCookie;

      if (name === "auth" || name === "sig" || name === "token") {
        const [, value] = splitCookie;
        const decipher = createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(value, "hex", "utf-8");

        decrypted += decipher.final("utf-8");
        return [name, decrypted];
      }

      return splitCookie;
    });

    const cookieReq = req;
    cookieReq.cookies = Object.fromEntries(splitCookies) as object;

    next();
  } catch (err) {
    const error = new ApiError("Sever error. Please try again later");
    next(error);
  }
};
