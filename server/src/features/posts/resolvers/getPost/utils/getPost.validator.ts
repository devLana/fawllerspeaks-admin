import Joi from "joi";

export const getPostSchema = Joi.string()
  .required()
  .trim()
  .messages({ "string.empty": "Provide post slug" });
