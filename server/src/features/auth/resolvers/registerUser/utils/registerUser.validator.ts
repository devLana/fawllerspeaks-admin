import Joi from "joi";
import type { RegisterUserInput } from "@resolverTypes";

export const registerUserValidator = Joi.object<RegisterUserInput>({
  firstName: Joi.string()
    .required()
    .trim()
    .pattern(/[\d]/, { invert: true })
    .messages({
      "string.empty": "Enter first name",
      "string.pattern.invert.base": "First name cannot contain numbers",
    }),
  lastName: Joi.string()
    .required()
    .trim()
    .pattern(/[\d]/, { invert: true })
    .messages({
      "string.empty": "Enter last name",
      "string.pattern.invert.base": "Last name cannot contain numbers",
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
