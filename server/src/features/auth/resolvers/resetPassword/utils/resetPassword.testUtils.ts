import { unRegisteredUser } from "@tests";
import type { InputErrors } from "@types";

interface Input {
  token: string;
  password: string;
  confirmPassword: string;
}

interface GqlInputErrors {
  token: number | null;
  password: boolean | null;
  confirmPassword?: Record<string, never> | undefined;
}

type Validations = [string, Input, InputErrors<Input>][];

export const validations = (nullOrUndefined: null | undefined): Validations => [
  [
    "Should return an error response if the input values are empty strings",
    { token: "", password: "", confirmPassword: "" },
    {
      tokenError: "Provide reset token",
      passwordError: "Enter password",
      confirmPasswordError: nullOrUndefined,
    },
  ],
  [
    "Should return an error response if the inputs are empty whitespace strings",
    { token: "   ", password: "             ", confirmPassword: "    " },
    {
      tokenError: "Provide reset token",
      passwordError:
        "Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol",
      confirmPasswordError: "Passwords do not match",
    },
  ],
  [
    "Should return an error response if the password is invalid and the confirm password does not match the password",
    { token: " reset_token  ", password: "h6J^", confirmPassword: "jamming" },
    {
      tokenError: nullOrUndefined,
      passwordError: "Password must be at least 8 characters long",
      confirmPasswordError: "Passwords do not match",
    },
  ],
  [
    "Should return an error response if the password and confirm password do not match",
    {
      token: "token_token_token_token_token_token",
      password: "#fast45CheckHfe",
      confirmPassword: "confirmPassword",
    },
    {
      tokenError: nullOrUndefined,
      passwordError: nullOrUndefined,
      confirmPasswordError: "Passwords do not match",
    },
  ],
];

export const gqlValidations: [string, GqlInputErrors][] = [
  [
    "Should throw a graphql validation error for null and undefined input values",
    { token: null, password: null, confirmPassword: undefined },
  ],
  [
    "Should throw a graphql validation error for number, boolean and object input values",
    { token: 839435, password: false, confirmPassword: {} },
  ],
];

export const verifyEmail: [string, string, string][] = [
  [
    "Should return an error response if the password reset token is unknown",
    "token_token_token",
    "NotAllowedError",
  ],
  [
    "Should return an error response if the user is unregistered",
    unRegisteredUser.resetToken[0],
    "RegistrationError",
  ],
];
