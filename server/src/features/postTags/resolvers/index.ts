import createPostTags from "./createPostTags";
import deletePostTags from "./deletePostTags";
import editPostTag from "./editPostTag";
import getPostTags from "./getPostTags";

import {
  PostTag,
  PostTagsResolvers,
  PostTagsWarningResolvers,
  DuplicatePostTagErrorResolvers,
} from "./types";

import { EditedPostTagResolvers } from "./editPostTag/EditedPostTag";
import { EditPostTagValidationErrorResolvers } from "./editPostTag/EditPostTagValidationError";

import { CreatePostTagsValidationErrorResolvers } from "./createPostTags/types/CreatePostTagsValidationError";
import { DeletePostTagsValidationErrorResolvers } from "./deletePostTags/DeletePostTagsValidationError";

import type {
  QueryResolvers,
  MutationResolvers,
  Resolvers,
} from "@resolverTypes";
import type { ResolversMapper, ObjectMapper } from "@types";

type TypeKeys =
  | "PostTag"
  | "PostTags"
  | "PostTagsWarning"
  | "EditedPostTag"
  | "DuplicatePostTagError"
  | "CreatePostTagsValidationError"
  | "DeletePostTagsValidationError"
  | "EditPostTagValidationError";

type MutationKeys = "createPostTags" | "editPostTag" | "deletePostTags";

interface PostTagsSchemaResolvers {
  Query: ResolversMapper<Pick<QueryResolvers, "getPostTags">>;
  Mutations: ResolversMapper<Pick<MutationResolvers, MutationKeys>>;
  Types: ObjectMapper<Pick<Resolvers, TypeKeys>>;
}

export const postTagsResolvers: PostTagsSchemaResolvers = {
  Query: { getPostTags },

  Mutations: { createPostTags, editPostTag, deletePostTags },

  Types: {
    PostTag,
    PostTags: PostTagsResolvers,
    PostTagsWarning: PostTagsWarningResolvers,
    EditedPostTag: EditedPostTagResolvers,
    DuplicatePostTagError: DuplicatePostTagErrorResolvers,
    CreatePostTagsValidationError: CreatePostTagsValidationErrorResolvers,
    DeletePostTagsValidationError: DeletePostTagsValidationErrorResolvers,
    EditPostTagValidationError: EditPostTagValidationErrorResolvers,
  },
};
