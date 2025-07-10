import Joi from "joi";

export const undoUnpublishPost = Joi.string()
  .required()
  .trim()
  .guid({ version: "uuidv4", separator: "-" })
  .messages({
    "string.empty": "Provide post id",
    "string.guid": "Invalid post id",
  });
