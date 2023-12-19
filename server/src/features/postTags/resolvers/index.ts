import createPostTags from "./createPostTags";
import deletePostTags from "./deletePostTags";
import editPostTag from "./editPostTag";
import getPostTags from "./getPostTags";

import {
  PostTag,
  PostTagsResolvers,
  DuplicatePostTagErrorResolvers,
} from "./types";

import {
  CreatedPostTagsWarningResolvers,
  CreatePostTagsValidationErrorResolvers,
} from "./createPostTags/types";

import {
  DeletedPostTagsResolvers,
  DeletedPostTagsWarningResolvers,
  DeletePostTagsValidationErrorResolvers,
} from "./deletePostTags/types";

import {
  EditedPostTagResolvers,
  EditedPostTagWarningResolvers,
  EditPostTagValidationErrorResolvers,
} from "./editPostTag/types";

import type {
  QueryResolvers,
  MutationResolvers,
  Resolvers,
} from "@resolverTypes";
import type { ResolversMapper, ObjectMapper } from "@types";

type TypeKeys =
  | "PostTag"
  | "PostTags"
  | "CreatedPostTagsWarning"
  | "DeletedPostTags"
  | "DeletedPostTagsWarning"
  | "EditedPostTag"
  | "EditedPostTagWarning"
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
    CreatedPostTagsWarning: CreatedPostTagsWarningResolvers,
    DeletedPostTags: DeletedPostTagsResolvers,
    DeletedPostTagsWarning: DeletedPostTagsWarningResolvers,
    EditedPostTag: EditedPostTagResolvers,
    EditedPostTagWarning: EditedPostTagWarningResolvers,
    DuplicatePostTagError: DuplicatePostTagErrorResolvers,
    CreatePostTagsValidationError: CreatePostTagsValidationErrorResolvers,
    DeletePostTagsValidationError: DeletePostTagsValidationErrorResolvers,
    EditPostTagValidationError: EditPostTagValidationErrorResolvers,
  },
};
