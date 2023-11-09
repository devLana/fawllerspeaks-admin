export const validations: [string, string, string][] = [
  [
    "E-mail validation fails, Return an error response for an empty email string",
    "",
    "Enter an e-mail address",
  ],
  [
    "E-mail validation fails, Return an error response for an empty whitespace email string",
    "    ",
    "Enter an e-mail address",
  ],
  [
    "E-mail validation fails, Return an error response for an invalid email string",
    "invalid_email",
    "Invalid e-mail address",
  ],
];

export const gqlValidations: [string, boolean | number | undefined | null][] = [
  ["Should throw a graphql validation error for a null email value", null],
  [
    "Should throw a graphql validation error for an undefined email value",
    undefined,
  ],
  ["Should throw a graphql validation error for a number email value", 59],
  ["Should throw a graphql validation error for a boolean email value", true],
];

export const msg =
  "A confirmation mail has been sent to the email address provided";
