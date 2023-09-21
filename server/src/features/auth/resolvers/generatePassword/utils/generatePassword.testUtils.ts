import { registeredUser } from "@tests";

export const validations: [string, string, string][] = [
  ["empty", "", "Enter an e-mail address"],
  ["empty whitespace", "    ", "Enter an e-mail address"],
  ["invalid", "invalid_email_string", "Invalid e-mail address"],
];

export const gqlValidations: [string, null | undefined | boolean | number][] = [
  ["null", null],
  ["undefined", undefined],
  ["number", 54659],
  ["boolean", true],
];

export const verifyMail: [string, Record<string, unknown>[]][] = [
  ["unknown e-mail address", []],
  ["e-mail with registered account", [{ isRegistered: true }]],
];

export const verifyMailE2E: [string, string, string][] = [
  ["unknown e-mail address", "example_mail@examplemail.com", "NotAllowedError"],
  ["e-mail with registered account", registeredUser.email, "RegistrationError"],
];
