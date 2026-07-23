import {
  newRegisteredReset,
  otherNewRegisteredReset,
  unregisteredReset,
} from "@utils/tests/mocks";

export const validations: Array<[string, string]> = [
  [
    "Should return a validation error response if the password reset token is an empty string",
    "",
  ],
  [
    "Should return a validation error response if the password reset token is an empty whitespace string",
    "    ",
  ],
];

export const verify: Array<[string, string, string]> = [
  [
    "Should return an error response if the password reset token is unknown",
    "token",
    "Unable to verify password reset token",
  ],
  [
    "Should return an error response if user tries to reset the password of an unregistered account",
    unregisteredReset.token,
    "The password of unregistered accounts cannot be reset",
  ],
  [
    "Should return an error if the password reset token has already been used",
    newRegisteredReset.token,
    "Unable to verify password reset token",
  ],
  [
    "Should return an error response if the password reset token has expired",
    otherNewRegisteredReset.token,
    "The password reset token has already expired",
  ],
];
