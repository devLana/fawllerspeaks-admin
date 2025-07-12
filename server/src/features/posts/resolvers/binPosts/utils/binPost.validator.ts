import Joi from "joi";

export const binPostValidator = Joi.array<string[]>()
  .required()
  .items(
    Joi.string().trim().guid({ version: "uuidv4", separator: "-" }).messages({
      "string.empty": "Input post ids cannot be empty values",
      "string.guid": "Invalid post id",
    })
  )
  .min(1)
  .unique()
  .messages({
    "array.min": "No post ids provided",
    "array.unique": "Input post ids can only contain unique ids",
    "array.base": "Post id input must be an array",
  });
