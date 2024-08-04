import Joi from "joi";
import sanitize from "sanitize-html";

import { sanitizeOptions } from "@features/posts/utils/sanitizeOptions";
import {
  anchorTagRegex,
  anchorTagReplacerFn,
} from "@features/posts/utils/anchorTagReplacerFn";

import type { DraftPostInput } from "@resolverTypes";

export const draftPostSchema = Joi.object<DraftPostInput>({
  title: Joi.string().required().trim().max(255).messages({
    "string.empty": "A title is required to save this post to draft",
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
  tagIds: Joi.array()
    .allow(null)
    .items(
      Joi.number().integer().positive().min(1).messages({
        "number.base": "Input post tag ids must be integer numbers",
        "number.positive": "Only positive post tag id numbers are allowed",
        "number.min": "The provided post tag ids must all be greater than 0",
      })
    )
    .min(1)
    .unique()
    .messages({
      "array.unique": "The provided input post tag ids should be unique ids",
      "array.min": "No post tag id was provided",
      "array.base": "Input value must be an array",
    }),
  imageBanner: Joi.string().allow(null).trim().messages({
    "string.empty": "Post image banner url cannot be empty",
  }),
});
