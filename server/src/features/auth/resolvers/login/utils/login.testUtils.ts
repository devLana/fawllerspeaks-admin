import { registeredUser } from "@tests";

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

export const args = { email: "test_mail@example.com", password: "df_i4irh983" };
export const dateCreated = "2022-11-07 13:22:43.717+01";

export const validations = (nullOrUndefined: null | undefined): Validations => [
  [
    "Should return a validation error response for empty email and password strings",
    { email: "", password: "" },
    ["Enter an e-mail address", "Enter password"],
  ],
  [
    "Should return a validation error response for an empty whitespace email string",
    { email: "   ", password: "   " },
    ["Enter an e-mail address", nullOrUndefined],
  ],
  [
    "Should return a validation error response for an invalid email and empty password input strings",
    { email: "invalid_email", password: "grdte" },
    ["Invalid e-mail address", nullOrUndefined],
  ],
];

export const gqlValidation: [string, GQLErrors][] = [
  [
    "Should throw a graphql validation error for null input values",
    { email: null, password: null },
  ],
  [
    "Should throw a graphql validation error for undefined input values",
    { email: undefined, password: undefined },
  ],
  [
    "Should throw a graphql validation error for boolean input values",
    { email: true, password: false },
  ],
  [
    "Should throw a graphql validation error for number input values",
    { email: 23453, password: 7565767 },
  ],
  [
    "Should throw a graphql validation error for object input values",
    { email: {}, password: [] },
  ],
];

export const verifyInputs: [string, { email: string; password: string }][] = [
  [
    "Should return an error response if the e-mail address is unknown",
    { email: "unknown_email@example.com", password: "pass_pass_apps" },
  ],
  [
    "Should return an error response if the e-mail & password combination is incorrect",
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
