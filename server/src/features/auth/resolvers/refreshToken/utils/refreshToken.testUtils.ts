type GQL = [
  string,
  boolean | number | [] | Record<string, unknown> | undefined | null
];

export const cookies = { auth: "auth", sig: "sig", token: "token" };
export const jwToken = `${cookies.sig}.${cookies.auth}.${cookies.token}`;
export const token = "refresh.token.string";
export const sessionId = "session_id_string";
export const loggedInUserId = "user_user";

export const authUserId = "28d9e034-11d1-46f2-8df5-a2ef94802d9c";
export const authCookies = {
  auth: "eyJzdWIiOiIyOGQ5ZTAzNC0xMWQxLTQ2ZjItOGRmNS1hMmVmOTQ4MDJkOWMiLCJpYXQiOjE2OTU4NDA2ODMsImV4cCI6MTY5NTg0MDY4M30",
  token: "aiSxMDQYPhsKJ8n8Tfaq1ryJZrpjEwVbn1ADAepOWds",
  sig: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
};
export const authToken = `${authCookies.sig}.${authCookies.auth}.${authCookies.token}`;

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

export const validJwt: [string, Record<string, string>[]][] = [
  ["session id is unknown", []],
  ["session was not assigned to the current user", [{ user: "not_the_user" }]],
];
