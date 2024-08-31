import Joi from "joi";
import type {
  QueryGetPostsArgs,
  GetPostsPageInput,
  GetPostsFiltersInput,
} from "@resolverTypes";

export const getPostsSchema = Joi.object<QueryGetPostsArgs>({
  page: Joi.object<GetPostsPageInput>({
    cursor: Joi.string().required().trim().messages({
      "string.empty": "Posts pagination cursor is required",
    }),

    type: Joi.string().required().trim().valid("after", "before").messages({
      "string.empty": "Posts pagination type is required",
      "any.only": "Invalid posts pagination type provided",
    }),
  }).allow(null),

  filters: Joi.object<GetPostsFiltersInput>({
    status: Joi.string()
      .allow(null)
      .trim()
      .valid("Draft", "Published", "Unpublished")
      .messages({ "any.only": "Invalid post status filter provided" }),

    sort: Joi.string()
      .allow(null)
      .trim()
      .valid("date_desc", "date_asc", "title_desc", "title_asc")
      .messages({ "any.only": "Invalid post sort filter provided" }),
  }).allow(null),
});
