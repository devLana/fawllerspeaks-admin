import type { Cookies } from "@types";

type GQL = [
  string,
  boolean | number | [] | Record<string, unknown> | undefined | null
];

export const cookieString = "auth=auth; sig=sig; token=token";
export const cookies = { auth: "auth", sig: "sig", token: "token" };
export const token = "refresh.token.string";
export const sessionId = "session_id_string";
export const loggedInUserId = "user_user";
export const email = "test@mail.com";

export const dbResponse = {
  refreshToken: `${cookies.sig}.${cookies.auth}.${cookies.token}`,
  email: "mail@mail.com",
  firstName: "first_name",
  lastName: "last_name",
  image: null,
  dateCreated: 54787683464,
};

export const data = {
  email: dbResponse.email,
  firstName: dbResponse.firstName,
  lastName: dbResponse.lastName,
  image: dbResponse.image,
  dateCreated: dbResponse.dateCreated,
};

export const validations: [string, string][] = [
  ["empty", ""],
  ["empty whitespace", "    "],
];

export const validateCookies: [string, Cookies][] = [
  ["invalid values", { ...cookies, auth: "" }],
  ["one or more missing cookies", { sig: "sig", auth: "auth" }],
];

export const validateSession: [string, Record<string, string>[]][] = [
  ["session id is unknown", []],
  [
    "refresh token was not signed for the user of the provided session",
    [{ userId: "fake_user_id" }],
  ],
];

export const obj = {
  sessionId,
  userId: "user_Id_One",
  isRegistered: false,
};

export const mockObj = {
  ...dbResponse,
  userId: loggedInUserId,
  isRegistered: true,
};

export const gqlValidations: GQL[] = [
  ["a null", null],
  ["an undefined", undefined],
  ["a number", 59],
  ["a boolean", true],
  ["an array", []],
  ["an object", {}],
];

export const verifyE2eCookie: [string, string][] = [
  ["invalid cookie values", "auth=auth; sig= ; token=token"],
  ["missing cookies", "auth=auth; sig=sig"],
];
