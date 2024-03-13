import { unRegisteredUser } from "@tests/mocks";

export const validations: [string, string][] = [
  [
    "Should return a validation error response if the password reset token is an empty string",
    "",
  ],
  [
    "Should return a validation error response if the password reset token is an empty whitespace string",
    "    ",
  ],
];

export const gqlValidations: [string, number | boolean | null | undefined][] = [
  ["Should throw a graphql validation error for null token values", null],
  [
    "Should throw a graphql validation error for undefined token values",
    undefined,
  ],
  ["Should throw a graphql validation error for number token values", 54659],
  ["Should throw a graphql validation error for boolean token values", true],
];

export const verifyToken: [string, string, string][] = [
  [
    "Should return an error response if the password reset token is unknown",
    "token",
    "NotAllowedError",
  ],
  [
    "Should return an error response if the user's account is unregistered",
    unRegisteredUser.resetToken[0],
    "RegistrationError",
  ],
];
