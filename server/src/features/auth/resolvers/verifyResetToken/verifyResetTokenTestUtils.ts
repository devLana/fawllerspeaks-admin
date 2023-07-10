import { unRegisteredUser } from "@tests";

export const validations: [string, string][] = [
  ["empty ", ""],
  ["empty whitespace", "    "],
];

export const gqlValidations: [string, number | boolean | null | undefined][] = [
  ["null", null],
  ["undefined", undefined],
  ["number", 54659],
  ["boolean", true],
];

export const verifyToken: [string, string, string][] = [
  ["unknown reset token", "token", "NotAllowedError"],
  ["unregistered account", unRegisteredUser.resetToken[0], "RegistrationError"],
];
