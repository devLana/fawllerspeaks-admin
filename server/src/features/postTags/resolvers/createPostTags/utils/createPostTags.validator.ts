import Joi from "joi";
import type { MutationCreatePostTagsArgs as Args } from "@resolverTypes";

export const createPostTagsValidator = Joi.array<Args["tags"]>()
  .required()
  .items(
    Joi.string().trim().messages({
      "string.empty": "Input tags cannot contain empty values",
    })
  )
  .min(1)
  .max(10)
  .unique((a: string, b: string) => {
    const aStripped = a.replace(/[\s_-]/g, "");
    const bStripped = b.replace(/[\s_-]/g, "");

    return aStripped.toLowerCase() === bStripped.toLowerCase();
  })
  .messages({
    "array.max": "Input tags can only contain at most {{#limit}} tags",
    "array.min": "No post tags were provided",
    "array.unique": "Input tags can only contain unique tags",
    "array.base": "Post tags input must be an array",
  });
