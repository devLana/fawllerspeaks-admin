export const validations: [string, string, string][] = [
  [
    "Should return an error response for an empty email string",
    "",
    "Enter an e-mail address",
  ],
  [
    "Should return an error response for an empty whitespace email string",
    "    ",
    "Enter an e-mail address",
  ],
  [
    "Should return an error response for an invalid email string",
    "invalid_email_string",
    "Invalid e-mail address",
  ],
];

export const gqlValidations: [string, boolean | number | null | undefined][] = [
  ["Should throw a graphql validation error for a null email value", null],
  [
    "Should throw a graphql validation error for an undefined email value",
    undefined,
  ],
  ["Should throw a graphql validation error for a number email value", 54659],
  ["Should throw a graphql validation error for a boolean email value", true],
];

export const msg1 = "Unable to reset the password for this user";
export const msg2 = "Unable to reset password for unregistered user";
export const message =
  "Your request is being processed and a mail will be sent to you shortly if that email address exists";

export const email = "test_mail@example.com";
