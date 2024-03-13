import { test, expect } from "@jest/globals";
import type { ValidationErrorItem } from "joi";

import generateErrorsObject from ".";

const errorList: ValidationErrorItem[] = [
  { message: "Enter email address", path: ["email"], type: "" },
  { message: "Enter first name", path: ["firstName"], type: "" },
  { message: "Enter last name", path: ["lastName"], type: "" },
  { message: "Enter password", path: ["password"], type: "" },
];

test("Utils | Generate Validation error object", () => {
  const errors = generateErrorsObject(errorList);

  expect(errors).toStrictEqual({
    emailError: "Enter email address",
    firstNameError: "Enter first name",
    lastNameError: "Enter last name",
    passwordError: "Enter password",
  });
});
