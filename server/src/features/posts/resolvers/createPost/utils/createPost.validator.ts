import Joi from "joi";
import sanitize from "sanitize-html";

import { sanitizeOptions } from "@features/posts/utils/sanitizeOptions";
import { processAnchorTags } from "@features/posts/utils/processAnchorTags";

import type { CreatePostInput } from "@resolverTypes";

export const createPostValidator = Joi.object<CreatePostInput>({
  title: Joi.string().required().trim().max(255).messages({
    "string.empty": "Provide post title",
    "string.max": "Post title can not be more than 255 characters",
  }),
  description: Joi.string().required().trim().max(255).messages({
    "string.empty": "Provide post description",
    "string.max": "Post description can not be more than 255 characters",
  }),
  excerpt: Joi.string().required().trim().max(300).messages({
    "string.empty": "Provide post excerpt",
    "string.max": "Post excerpt can not be more than 300 characters",
  }),
  content: Joi.string()
    .required()
    .trim()
    .custom((html: string) => {
      return processAnchorTags(sanitize(html, sanitizeOptions));
    }, "Custom content sanitizer")
    .messages({ "string.empty": "Provide post content" }),
  tagIds: Joi.array()
    .allow(null)
    .items(
      Joi.string().trim().uuid({ version: "uuidv4", separator: "-" }).messages({
        "string.empty": "Input post tag ids cannot be empty values",
        "string.guid": "Invalid post tag id provided",
      })
    )
    .min(1)
    .max(5)
    .unique()
    .messages({
      "array.unique": "The provided input post tag ids should be unique ids",
      "array.min": "No post tag id was provided",
      "array.max": "Cannot add more than 5 post tags to a new post",
      "array.base": "Input value must be an array",
    }),
  imageBanner: Joi.string().allow(null).trim().messages({
    "string.empty": "Post image banner url cannot be empty",
  }),
});
