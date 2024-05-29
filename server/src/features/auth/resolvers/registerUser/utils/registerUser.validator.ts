import Joi from "joi";
import type { RegisterUserInput } from "@resolverTypes";

export const registerUserValidator = Joi.object<RegisterUserInput>({
  firstName: Joi.string()
    .required()
    .trim()
    .pattern(/^\p{L}{2,}([ -]?\p{L}{2,})*$/u, "firstName")
    .messages({
      "string.empty": "Enter first name",
      "string.pattern.name": "First name contains an invalid character",
    }),
  lastName: Joi.string()
    .required()
    .trim()
    .pattern(/^\p{L}{2,}([ -]?\p{L}{2,})*$/u, "lastName")
    .messages({
      "string.empty": "Enter last name",
      "string.pattern.name": "Last name contains an invalid character",
    }),
  password: Joi.string()
    .required()
    .pattern(/\d+/)
    .pattern(/[a-z]+/)
    .pattern(/[A-Z]+/)
    .pattern(/[^a-z\d]+/i)
    .min(8)
    .messages({
      "string.empty": "Enter password",
      "string.pattern.base":
        "Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol",
      "string.min": "Password must be at least 8 characters long",
    }),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
});
