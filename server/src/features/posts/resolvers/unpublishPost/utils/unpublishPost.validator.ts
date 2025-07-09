import Joi from "joi";

export const unpublishPostValidator = Joi.string()
  .required()
  .trim()
  .guid({ version: "uuidv4", separator: "-" })
  .messages({
    "string.empty": "Provide post id",
    "string.guid": "Invalid post id",
  });
