import type { Cookies } from "@types";

type GQL = [
  string,
  boolean | number | [] | Record<string, unknown> | undefined | null
];

export const cookiesStr = "auth=auth; sig=sig; token=token";
export const cookies = { auth: "auth", sig: "sig", token: "token" };
export const jwToken = `${cookies.sig}.${cookies.auth}.${cookies.token}`;
export const token = "refresh.token.string";
export const sessionId = "session_id_string";
export const loggedInUserId = "user_user";

export const validateSession: [string, string][] = [
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
  ["is invalid", { auth: "", sig: "sig", token: "token" }],
  ["has missing fields", { sig: "sig", auth: "auth" }],
];

export const validJwt: [string, Record<string, string>[]][] = [
  ["session id is unknown", []],
  ["session was not assigned to the current user", [{ user: "not_the_user" }]],
];

export const verifyE2eCookie: [string, string][] = [
  ["invalid cookie values", "auth=auth; sig= ; token=token"],
  ["missing cookies", "auth=auth; sig=sig"],
];
