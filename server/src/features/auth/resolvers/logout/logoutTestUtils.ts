import type { Cookies } from "@types";

type GQL = [
  string,
  boolean | number | [] | Record<string, unknown> | undefined | null
];

export const validations: [string, string][] = [
  ["empty", ""],
  ["empty whitespace", "      "],
];

export const gqlValidations: GQL[] = [
  ["a null", null],
  ["an undefined", undefined],
  ["a number", 59],
  ["a boolean", true],
  ["an array", []],
  ["an object", {}],
];

export const validateCookie: [string, Cookies][] = [
  ["invalid", { auth: "", sig: "sig", token: "token" }],
  ["missing a field", { auth: "auth", sig: "sig" }],
];

export const verifyE2eCookie: [string, string][] = [
  ["invalid cookie values", "auth=auth; sig= ; token=token"],
  ["missing cookies", "auth=auth; sig=sig"],
];
