import { unRegisteredUser } from "@utils/tests/mocks";
import type { InputErrors } from "types/tests";

interface Input {
  token: string;
  password: string;
  confirmPassword: string;
}

export const validations: [string, Input, InputErrors<Input>][] = [
  [
    "Should return an error response if the input values are empty strings",
    { token: "", password: "", confirmPassword: "" },
    {
      tokenError: "Provide reset token",
      passwordError: "Enter password",
      confirmPasswordError: null,
    },
  ],
  [
    "Should return an error response if the inputs are empty whitespace strings",
    { token: "   ", password: "             ", confirmPassword: "    " },
    {
      tokenError: "Provide reset token",
      passwordError: `Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol`,
      confirmPasswordError: "Passwords do not match",
    },
  ],
  [
    "Should return an error response if the password is invalid and the confirm password does not match the password",
    { token: " reset_token  ", password: "h6J^", confirmPassword: "jamming" },
    {
      tokenError: null,
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
      tokenError: null,
      passwordError: null,
      confirmPasswordError: "Passwords do not match",
    },
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
