import Joi from "joi";

export const verifyTokenValidator = Joi.string()
  .required()
  .trim()
  .messages({ "string.empty": "Provide password reset token" });
