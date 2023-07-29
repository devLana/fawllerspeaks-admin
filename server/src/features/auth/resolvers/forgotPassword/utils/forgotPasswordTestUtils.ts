export const validations: [string, string, string][] = [
  ["empty", "", "Enter an e-mail address"],
  ["empty whitespace", "    ", "Enter an e-mail address"],
  ["invalid", "invalid_email_string", "Invalid e-mail address"],
];

export const gqlValidations: [string, boolean | number | null | undefined][] = [
  ["null", null],
  ["undefined", undefined],
  ["number", 54659],
  ["boolean", true],
];
