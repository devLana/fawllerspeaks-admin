export const validations: [string, string, string][] = [
  ["empty", "", "Enter an e-mail address"],
  ["empty whitespace", "    ", "Enter an e-mail address"],
  ["invalid", "invalid_email", "Invalid e-mail address"],
];

export const gqlValidations: [string, boolean | number | undefined | null][] = [
  ["null", null],
  ["undefined", undefined],
  ["number", 59],
  ["boolean", true],
];
