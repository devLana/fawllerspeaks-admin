import { registeredUser } from "@tests";
import { DATE_CREATED_MULTIPLIER } from "@utils";

interface Input {
  [key: string]: unknown;
  email: string;
  password: string;
}

interface GQLErrors {
  [key: string]: unknown;
  email: number | boolean | null | undefined | Record<string, string>;
  password: number | boolean | null | undefined | [];
}

type InputErrors = string | null | undefined;
type Validations = [string, Input, [InputErrors, InputErrors]][];

export const cookies = { auth: "auth", sig: "sig", token: "token" };
export const args = { email: "test_mail@example.com", password: "df_i4irh983" };
export const createdAt = Date.now();

export const validations = (nullOrUndefined: null | undefined): Validations => [
  [
    "empty email and password",
    { email: "", password: "" },
    ["Enter an e-mail address", "Enter password"],
  ],
  [
    "empty whitespace email and password",
    { email: "   ", password: "   " },
    ["Enter an e-mail address", nullOrUndefined],
  ],
  [
    "invalid email and empty password input values",
    { email: "invalid_email", password: "" },
    ["Invalid e-mail address", "Enter password"],
  ],
  [
    "empty password",
    { email: "  test@mail.com ", password: "" },
    [nullOrUndefined, "Enter password"],
  ],
  [
    "empty email",
    { email: "", password: "passwordEd" },
    ["Enter an e-mail address", nullOrUndefined],
  ],
];

export const gqlValidation: [string, GQLErrors][] = [
  ["null", { email: null, password: null }],
  ["undefined", { email: undefined, password: undefined }],
  ["boolean", { email: true, password: false }],
  ["number", { email: 23453, password: 7565767 }],
  ["object", { email: {}, password: [] }],
];

export const verifyInputs: [string, { email: string; password: string }][] = [
  [
    "e-mail address is unknown",
    { email: "unknown_email@example.com", password: "pass_pass_apps" },
  ],
  [
    "e-mail & password combination is incorrect",
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
  dateCreated: createdAt / DATE_CREATED_MULTIPLIER,
};
