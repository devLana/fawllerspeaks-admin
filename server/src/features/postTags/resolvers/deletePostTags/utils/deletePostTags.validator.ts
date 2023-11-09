import Joi from "joi";
import type { MutationDeletePostTagsArgs as Args } from "@resolverTypes";

export const deletePostTagsValidator = Joi.array<Args["tagIds"]>()
  .required()
  .items(
    Joi.string().trim().guid({ version: "uuidv4", separator: "-" }).messages({
      "string.empty": "Input tag ids cannot be empty strings",
      "string.guid": "Invalid post tag id",
    })
  )
  .min(1)
  .unique()
  .messages({
    "array.min": "No post tag provided",
    "array.unique": "No duplicate tags allowed. Input tag ids must be unique",
    "array.base": "Post tags input must be an array",
  });
