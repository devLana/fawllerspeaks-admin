import Joi from "joi";
import sanitize from "sanitize-html";

import { sanitizeOptions } from "@features/posts/utils/sanitizeOptions";
import {
  anchorTagRegex,
  anchorTagReplacerFn,
} from "@features/posts/utils/anchorTagReplacerFn";

import type { DraftPostInput } from "@resolverTypes";

export const draftPostSchema = Joi.object<DraftPostInput>({
  title: Joi.string().required().trim().messages({
    "string.empty": "A title is required to save this post to draft",
  }),
  description: Joi.string().allow(null).trim().messages({
    "string.empty": "Provide post description",
  }),
  excerpt: Joi.string().allow(null).trim().messages({
    "string.empty": "Provide post excerpt",
  }),
  content: Joi.string()
    .allow(null)
    .trim()
    .custom((value: string | null) => {
      if (!value) return value;

      const html = value
        .replace(/<p>(?:<br>)*&nbsp;<\/p>/g, "")
        .replace(/>&nbsp;<\//g, "></");

      return sanitize(html, sanitizeOptions)
        .replace(/\s\/>/g, "/>")
        .replace(anchorTagRegex, anchorTagReplacerFn);
    }, "Custom content sanitizer")
    .messages({ "string.empty": "Provide post content" }),
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
