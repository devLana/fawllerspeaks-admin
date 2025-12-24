import {
  newRegisteredReset,
  otherNewRegisteredReset,
  unregisteredReset,
} from "@utils/tests/mocks";

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

export const verify: [string, string, string, string][] = [
  [
    "Should return an error response if the password reset token is unknown",
    "token",
    "UnknownError",
    "Unable to verify password reset token",
  ],
  [
    "Should return an error response if user tries to reset the password of an unregistered account",
    unregisteredReset.token,
    "RegistrationError",
    "The password of unregistered accounts cannot be reset",
  ],
  [
    "Should return an error if the password reset token has already been used",
    newRegisteredReset.token,
    "NotAllowedError",
    "Unable to verify password reset token",
  ],
  [
    "Should return an error response if the password reset token has expired",
    otherNewRegisteredReset.token,
    "NotAllowedError",
    "The password reset token has already expired",
  ],
];
