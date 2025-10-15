import type { CookieOptions, Response } from "express";

import { nodeEnv } from "@utils/nodeEnv";
import type { Cookies } from "@types";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  ...((nodeEnv === "production" || nodeEnv === "demo") && {
    domain: "fawllerspeaks.com",
    sameSite: "none",
  }),
};

const createCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 365 * 24 * 60 * 60 * 1000,
};

const clearCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 0,
};

export const setCookies = (res: Response, cookies: Required<Cookies>) => {
  res.cookie("auth", cookies.auth, createCookieOptions);
  res.cookie("token", cookies.token, createCookieOptions);
  res.cookie("sig", cookies.sig, createCookieOptions);
};

export const clearCookies = (res: Response) => {
  res.clearCookie("auth", clearCookieOptions);
  res.clearCookie("token", clearCookieOptions);
  res.clearCookie("sig", clearCookieOptions);
};
