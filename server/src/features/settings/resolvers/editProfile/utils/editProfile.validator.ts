import Joi from "joi";
import type { MutationEditProfileArgs } from "@resolverTypes";

export const editProfileValidator = Joi.object<MutationEditProfileArgs>({
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
    .pattern(/^\p{L}{2,}([ -]?\p{L}{2,})*$/u, "firstName")
    .messages({
      "string.empty": "Enter last name",
      "string.pattern.name": "Last name contains an invalid character",
    }),
  image: Joi.string().trim().allow(null).messages({
    "string.empty": "Profile image url cannot be empty",
  }),
});
