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
  ["Should return an error response if the session id is an empty string", ""],
  [
    "Should return an error response if the session id is an empty whitespace string",
    "      ",
  ],
];

export const gqlValidations: GQL[] = [
  ["Should throw a graphql validation error for a null session id value", null],
  [
    "Should throw a graphql validation error for an undefined session id value",
    undefined,
  ],
  ["Should throw a graphql validation error for a number session id value", 59],
  [
    "Should throw a graphql validation error for a boolean session id value",
    true,
  ],
  ["Should throw a graphql validation error for an array session id value", []],
  [
    "Should throw a graphql validation error for an object session id value",
    {},
  ],
];

export const validJwt: [string, Record<string, string>[]][] = [
  ["Should return an error response if the session id is unknown", []],
  [
    "Should return an error response if the session was not assigned to the current user",
    [{ userUUID: "not_the_user" }],
  ],
];
