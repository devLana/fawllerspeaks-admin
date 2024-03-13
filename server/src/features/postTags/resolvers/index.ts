import createPostTags from "./createPostTags";
import deletePostTags from "./deletePostTags";
import editPostTag from "./editPostTag";
import getPostTags from "./getPostTags";

import { DuplicatePostTagErrorResolvers } from "./types/DuplicatePostTagError";
import { PostTag } from "./types/PostTag";
import { PostTagsResolvers } from "./types/PostTags";

import { CreatedPostTagsWarningResolvers } from "./createPostTags/types/CreatedPostTagsWarning";
import { CreatePostTagsValidationErrorResolvers } from "./createPostTags/types/CreatePostTagsValidationError";

import { DeletedPostTagsResolvers } from "./deletePostTags/types/DeletedPostTags";
import { DeletedPostTagsWarningResolvers } from "./deletePostTags/types/DeletedPostTagsWarning";
import { DeletePostTagsValidationErrorResolvers } from "./deletePostTags/types/DeletePostTagsValidationError";

import { EditPostTagValidationErrorResolvers } from "./editPostTag/types/EditPostTagValidationError";
import { EditedPostTagResolvers } from "./editPostTag/types/EditedPostTag";
import { EditedPostTagWarningResolvers } from "./editPostTag/types/EditedPostTagWarning";

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
