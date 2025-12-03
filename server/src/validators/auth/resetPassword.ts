import Joi from "joi";
import type { MutationResetPasswordArgs } from "@resolverTypes";

export const resetPasswordValidator = Joi.object<MutationResetPasswordArgs>({
  token: Joi.string()
    .required()
    .trim()
    .messages({ "string.empty": "Provide reset token" }),
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
