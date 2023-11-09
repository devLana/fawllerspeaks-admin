import Joi from "joi";

export const sessionIdValidator = Joi.string().required().trim().messages({
  "string.empty": "Invalid session id",
});
