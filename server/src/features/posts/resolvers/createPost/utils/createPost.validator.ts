import Joi from "joi";
import type { CreatePostInput } from "@resolverTypes";

export const createPostValidator = Joi.object<CreatePostInput>({
  title: Joi.string().required().trim().messages({
    "string.empty": "Provide post title",
  }),
  description: Joi.string().required().trim().messages({
    "string.empty": "Provide post description",
  }),
  content: Joi.string().required().trim().messages({
    "string.empty": "Provide post content",
  }),
  tags: Joi.array()
    .allow(null)
    .items(
      Joi.string().trim().uuid({ version: "uuidv4", separator: "-" }).messages({
        "string.empty": "Input post tags cannot be empty values",
        "string.guid": "Invalid post tag id",
      })
    )
    .min(1)
    .unique()
    .messages({
      "array.unique": "Input tags can only contain unique tags",
      "array.min": "No post tags were provided",
      "array.base": "Post tags input must be an array",
    }),
  imageBanner: Joi.string().allow(null).trim().messages({
    "string.empty": "Post image banner url cannot be empty",
  }),
});
