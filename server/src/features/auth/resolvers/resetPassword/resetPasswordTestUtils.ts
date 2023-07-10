import { unRegisteredUser } from "@tests";

interface Input {
  [key: string]: string;
  token: string;
  password: string;
  confirmPassword: string;
}

interface GqlInputErrors {
  [key: string]: unknown;
  token?: number | null;
  password?: boolean | null;
  confirmPassword?: Record<string, unknown>;
}

type InputErrors = {
  [Prop in keyof Input as `${string & Prop}Error`]: string | null | undefined;
};

type Validations = [string, Input, InputErrors][];

export const validations = (nullOrUndefined: null | undefined): Validations => [
  [
    "empty input values",
    { token: "", password: "", confirmPassword: "" },
    {
      tokenError: "Provide reset token",
      passwordError: "Enter password",
      confirmPasswordError: nullOrUndefined,
    },
  ],
  [
    "empty whitespace input values and password mismatch",
    { token: "   ", password: "             ", confirmPassword: "    " },
    {
      tokenError: "Provide reset token",
      passwordError:
        "Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol",
      confirmPasswordError: "Passwords do not match",
    },
  ],
  [
    "invalid password and password mismatch",
    { token: " reset_token  ", password: "h6J^", confirmPassword: "jamming" },
    {
      tokenError: nullOrUndefined,
      passwordError: "Password must be at least 8 characters long",
      confirmPasswordError: "Passwords do not match",
    },
  ],
  [
    "password mismatch",
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
    "null and undefined",
    { token: null, password: null, confirmPassword: undefined },
  ],
  [
    "number, boolean and object",
    { token: 839435, password: false, confirmPassword: {} },
  ],
];

export const verifyEmail: [string, string, string][] = [
  ["unknown reset token", "token_token_token", "NotAllowedError"],
  ["unregistered account", unRegisteredUser.resetToken[0], "RegistrationError"],
];
