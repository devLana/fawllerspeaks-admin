import { registeredUser } from "@tests";

interface Input {
  [key: string]: unknown;
  email: string;
  password: string;
  sessionId?: string | null;
}

interface GQLErrors {
  [key: string]: unknown;
  email: number | boolean | null | undefined | Record<string, string>;
  password: number | boolean | null | undefined | [];
}

type InputErrors = string | null | undefined;
type Validations = [string, Input, [InputErrors, InputErrors, InputErrors]][];

export const cookies = { auth: "auth", sig: "sig", token: "token" };
export const args = { email: "test_mail@example.com", password: "df_i4irh983" };

export const dateCreated = "2022-11-07 13:22:43.717+01";

export const validations = (nullOrUndefined: null | undefined): Validations => [
  [
    "Return a validation error for an empty email, password and session id",
    { email: "", password: "", sessionId: "" },
    ["Enter an e-mail address", "Enter password", "Enter session id"],
  ],
  [
    "Return a validation error for an empty whitespace email and session id",
    { email: "   ", password: "   ", sessionId: "    " },
    ["Enter an e-mail address", nullOrUndefined, "Enter session id"],
  ],
  [
    "Return a validation error for an invalid email and empty password input values",
    { email: "invalid_email", password: "grdte", sessionId: "session_id" },
    ["Invalid e-mail address", nullOrUndefined, nullOrUndefined],
  ],
];

export const gqlValidation: [string, GQLErrors][] = [
  [
    "Throw a graphql validation error for null input values",
    { email: null, password: null },
  ],
  [
    "Throw a graphql validation error for undefined input values",
    { email: undefined, password: undefined, sessionId: undefined },
  ],
  [
    "Throw a graphql validation error for boolean input values",
    { email: true, password: false, sessionId: true },
  ],
  [
    "Throw a graphql validation error for number input values",
    { email: 23453, password: 7565767, sessionId: 781 },
  ],
  [
    "Throw a graphql validation error for object input values",
    { email: {}, password: [], sessionId: [] },
  ],
];

export const verifyInputs: [string, { email: string; password: string }][] = [
  [
    "Return an error if the e-mail address is unknown",
    { email: "unknown_email@example.com", password: "pass_pass_apps" },
  ],
  [
    "Return an error if the e-mail & password combination is incorrect",
    { email: registeredUser.email, password: "password123" },
  ],
];

export const mockUser = {
  userEmail: "test_mail@example.com",
  firstName: null,
  lastName: null,
  image: null,
  userId: "user id",
  isRegistered: false,
  dateCreated,
};
