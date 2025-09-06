import Joi from "joi";
import type { QueryGetPostsArgs } from "@resolverTypes";

export const getPostsSchema = Joi.object<QueryGetPostsArgs>({
  after: Joi.string().trim().allow(null).messages({
    "string.empty": "Posts pagination after cursor cannot be an empty string",
  }),
  size: Joi.number()
    .min(6)
    .max(30)
    .default(12)
    .custom((value: number, _) => {
      const num = Math.floor(value);
      const remainder = num % 6;
      return remainder === 0 ? num : num - remainder;
    }, "Multiple of 6 transformation")
    .allow(null)
    .messages({
      "number.base": "Invalid page size provided. Only numbers allowed",
      "number.min": "Posts pagination page size must be at least 6",
      "number.max": "Posts pagination page size is too large. Maximum is 30",
    }),
  sort: Joi.string()
    .trim()
    .valid("date_desc", "date_asc", "title_desc", "title_asc")
    .default("date_desc")
    .allow(null)
    .messages({ "any.only": "Invalid post sort filter provided" }),
  status: Joi.string()
    .trim()
    .valid("Draft", "Published", "Unpublished")
    .allow(null)
    .messages({ "any.only": "Invalid post status filter provided" }),
});
