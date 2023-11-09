import Joi from "joi";
import type { MutationLoginArgs } from "@resolverTypes";

export const loginValidator = Joi.object<MutationLoginArgs>({
  email: Joi.string().email().required().trim().messages({
    "string.empty": "Enter an e-mail address",
    "string.email": "Invalid e-mail address",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Enter password",
  }),
  sessionId: Joi.string().trim().allow(null).messages({
    "string.empty": "Enter session id",
  }),
});
