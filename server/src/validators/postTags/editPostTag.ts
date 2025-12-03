import Joi from "joi";
import type { MutationEditPostTagArgs } from "@resolverTypes";

export const editPostTagValidator = Joi.object<MutationEditPostTagArgs>({
  tagId: Joi.string()
    .required()
    .trim()
    .uuid({ version: "uuidv4", separator: "-" })
    .messages({
      "string.guid": "Invalid post tag id",
      "string.empty": "Provide post tag id",
    }),
  name: Joi.string().required().trim().messages({
    "string.empty": "Provide post tag name",
  }),
});
