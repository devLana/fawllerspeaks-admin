import Joi from "joi";
import type { MutationChangePasswordArgs } from "@resolverTypes";

export const changePasswordValidator = Joi.object<MutationChangePasswordArgs>({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Enter current password",
  }),
  newPassword: Joi.string()
    .required()
    .pattern(/\d+/)
    .pattern(/[a-z]+/)
    .pattern(/[A-Z]+/)
    .pattern(/[^a-z\d]+/i)
    .min(8)
    .messages({
      "string.empty": "Enter new password",
      "string.pattern.base":
        "New password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol",
      "string.min": "New Password must be at least 8 characters long",
    }),
  confirmNewPassword: Joi.any()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
});
