import type { Response, NextFunction } from "express";

import type { Cookies, GQLRequest } from "@appTypes";
import { hmacRefreshToken } from "@utils/auth/signTokens";

export const parseCookies = (
  req: GQLRequest,
  _: Response,
  next: NextFunction,
) => {
  if (!req.headers.cookie) {
    const cookieReq = req;
    cookieReq.cookies = {};
    next();
    return;
  }

  const cookies = req.headers.cookie.split(/;\s?/);
  const parsedCookies: Cookies = {};

  for (const cookie of cookies) {
    const [name, value] = cookie.split(/=/);

    if (name === "auth") {
      try {
        const hashedToken = hmacRefreshToken(value);
        parsedCookies[name] = hashedToken;
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
