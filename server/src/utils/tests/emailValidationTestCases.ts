export const emailValidationsTestCases: [string, string, string][] = [
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
