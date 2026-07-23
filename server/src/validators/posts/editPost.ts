import Joi from "joi";
import sanitize from "sanitize-html";

import { sanitizeOptions } from "@utils/posts/sanitizeOptions";
import { processAnchorTags } from "@utils/posts/processAnchorTags";
import { stripContentRegex } from "@utils/posts/constants";
import type { EditPostInput } from "@appTypes/resolverTypes";

export const editPostValidator = Joi.object<EditPostInput>({
  id: Joi.string()
    .required()
    .trim()
    .uuid({ version: "uuidv4", separator: "-" })
    .messages({
      "string.empty": "Provide post id",
      "string.guid": "Invalid post id",
    }),
  title: Joi.string().required().trim().max(255).messages({
    "string.empty": "Provide post title",
    "string.max": "Post title can not be more than 255 characters",
  }),
  description: Joi.string().allow(null).trim().max(255).messages({
    "string.empty": "Provide post description",
    "string.max": "Post description can not be more than 255 characters",
  }),
  excerpt: Joi.string().allow(null).trim().max(300).messages({
    "string.empty": "Provide post excerpt",
    "string.max": "Post excerpt can not be more than 300 characters",
  }),
  content: Joi.string()
    .allow(null)
    .trim()
    .custom((htmlContent: string | null) => {
      if (!htmlContent) return null;

      const sanitized = sanitize(htmlContent, sanitizeOptions);
      const html = sanitized.replace(stripContentRegex, "");
      return processAnchorTags(html);
    }, "Custom content sanitizer")
    .messages({ "string.empty": "Provide post content" }),
  tagIds: Joi.array()
    .allow(null)
    .items(
      Joi.string().trim().uuid({ version: "uuidv4", separator: "-" }).messages({
        "string.empty": "Input post tag ids cannot be empty values",
        "string.guid": "Invalid post tag id provided",
      }),
    )
    .min(1)
    .max(5)
    .unique()
    .messages({
      "array.unique": "The provided input post tag ids should be unique ids",
      "array.min": "No post tag id was provided",
      "array.max": "Cannot add more than 5 post tags to a post",
      "array.base": "Post tags input must be an array",
    }),
  imageBanner: Joi.string().allow(null).trim().messages({
    "string.empty": "Post image banner url cannot be empty",
  }),
  editStatus: Joi.bool().allow(null).messages({
    "boolean.base": "Provide a boolean value",
  }),
});
