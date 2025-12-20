import type { CookieOptions, Response } from "express";
import { env } from "@lib/env";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  ...(env.NAME !== "test" && { sameSite: "none" }),
  ...((env.NAME === "production" || env.NAME === "demo") && {
    domain: "fawllerspeaks.com",
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

export const setAuthCookie = (res: Response, cookie: string) => {
  res.cookie("auth", cookie, createCookieOptions);
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie("auth", clearCookieOptions);
};
