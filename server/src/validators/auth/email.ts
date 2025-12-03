import Joi from "joi";

export const emailValidator = Joi.string().email().required().trim().messages({
  "string.empty": "Enter an e-mail address",
  "string.email": "Invalid e-mail address",
});
