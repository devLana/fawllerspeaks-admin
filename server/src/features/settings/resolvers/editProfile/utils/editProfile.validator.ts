import Joi from "joi";
import type { MutationEditProfileArgs } from "@resolverTypes";

export const editProfileValidator = Joi.object<MutationEditProfileArgs>({
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
  image: Joi.string().trim().allow(null).messages({
    "string.empty": "Profile image url cannot be empty",
  }),
});
