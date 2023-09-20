import type { CookieOptions, Response } from "express";

// import { nodeEnv } from "@utils";
import type { Cookies } from "@types";

export const cookieOptions: CookieOptions = {
  maxAge: 365 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",

  /** Postman cookie options */
  // secure: nodeEnv === "production",

  /** Apollo explorer(development) cookie options */
  secure: true,
};

export const setCookies = (res: Response, cookies: Required<Cookies>) => {
  res.cookie("auth", cookies.auth, cookieOptions);
  res.cookie("token", cookies.token, cookieOptions);
  res.cookie("sig", cookies.sig, cookieOptions);
};

export const clearCookies = (res: Response) => {
  res.clearCookie("auth", cookieOptions);
  res.clearCookie("token", cookieOptions);
  res.clearCookie("sig", cookieOptions);
};
