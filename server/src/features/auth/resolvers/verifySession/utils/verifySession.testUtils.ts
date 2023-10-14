type GQL = [
  string,
  boolean | number | [] | Record<string, unknown> | undefined | null
];

export const dateCreated = "2022-11-07 13:22:43.717+01";
export const cookies = { auth: "auth", sig: "sig", token: "token" };
export const sessionId = "session_id_string";
export const loggedInUserId = "user_user";
export const email = "test@mail.com";

const authUserId = "28d9e034-11d1-46f2-8df5-a2ef94802d9c";
export const authCookies = {
  auth: "eyJzdWIiOiIyOGQ5ZTAzNC0xMWQxLTQ2ZjItOGRmNS1hMmVmOTQ4MDJkOWMiLCJpYXQiOjE2OTU4NDA2ODMsImV4cCI6MTY5NTg0MDY4M30",
  token: "aiSxMDQYPhsKJ8n8Tfaq1ryJZrpjEwVbn1ADAepOWds",
  sig: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
};

export const data = {
  email: "mail@mail.com",
  firstName: "first_name",
  lastName: "last_name",
  image: null,
  dateCreated,
};

export const validations: [string, string][] = [
  ["empty", ""],
  ["empty whitespace", "    "],
];

export const obj = {
  ...data,
  userId: authUserId,
  isRegistered: false,
};

export const mockObj = {
  ...data,
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
