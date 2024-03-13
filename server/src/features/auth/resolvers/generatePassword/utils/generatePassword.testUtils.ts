import { registeredUser } from "@tests/mocks";

export const validations: [string, string, string][] = [
  [
    "Should return an error for an empty email string",
    "",
    "Enter an e-mail address",
  ],
  [
    "Should return an error for an empty whitespace email string",
    "    ",
    "Enter an e-mail address",
  ],
  [
    "Should return an error for an invalid email string",
    "invalid_email_string",
    "Invalid e-mail address",
  ],
];

export const gqlValidations: [string, null | undefined | boolean | number][] = [
  ["Should throw graphql validation error for a null email value", null],
  [
    "Should throw graphql validation error for an undefined email value",
    undefined,
  ],
  ["Should throw graphql validation error for a number email value", 54659],
  ["Should throw graphql validation error for a boolean email value", true],
];

export const verifyMail: [string, Record<string, unknown>[]][] = [
  ["Should return an error response for an unknown e-mail address", []],
  [
    "Should return an error response if the provided e-mail is for a registered account",
    [{ isRegistered: true }],
  ],
];

export const verifyMailE2E: [string, string, string][] = [
  [
    "Should return an error response for an unknown e-mail address",
    "example_mail@examplemail.com",
    "NotAllowedError",
  ],
  [
    "Should return an error response if the provided e-mail is for a registered account",
    registeredUser.email,
    "RegistrationError",
  ],
];

export const email = "test_mail@example.com";
export const msg =
  "A confirmation mail will be sent to the email address provided";
