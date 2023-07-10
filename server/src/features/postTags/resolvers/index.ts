import createPostTags from "./createPostTags";
import deletePostTags from "./deletePostTags";
import editPostTag from "./editPostTag";
import getPostTags from "./getPostTags";

import {
  PostTagsResolver,
  PostTagsWarningResolver,
  DuplicatePostTagErrorResolver,
} from "./types";
import { EditedPostTagResolver } from "./editPostTag/EditedPostTag";
import { CreatePostTagsValidationErrorResolver } from "./createPostTags/CreatePostTagsValidationError";
import { DeletePostTagsValidationErrorResolver } from "./deletePostTags/DeletePostTagsValidationError";
import { EditPostTagValidationErrorResolver } from "./editPostTag/EditPostTagValidationError";

import type {
  QueryResolvers,
  MutationResolvers,
  Resolvers,
} from "@resolverTypes";
import type { ResolversMapper, ObjectMapper } from "@types";

type TypeKeys =
  | "PostTags"
  | "PostTagsWarning"
  | "EditedPostTag"
  | "DuplicatePostTagError"
  | "CreatePostTagsValidationError"
  | "DeletePostTagsValidationError"
  | "EditPostTagValidationError";

type MutationKeys = "createPostTags" | "editPostTag" | "deletePostTags";

type PostTagsQuery = Pick<QueryResolvers, "getPostTags">;
type PostTagsMutations = Pick<MutationResolvers, MutationKeys>;
type PostTagsTypes = Pick<Resolvers, TypeKeys>;

interface PostTagsResolvers {
  Query: ResolversMapper<PostTagsQuery>;
  Mutations: ResolversMapper<PostTagsMutations>;
  Types: ObjectMapper<PostTagsTypes>;
}

export const postTagsResolvers: PostTagsResolvers = {
  Query: {
    getPostTags,
  },

  Mutations: {
    createPostTags,
    editPostTag,
    deletePostTags,
  },

  Types: {
    PostTags: PostTagsResolver,
    PostTagsWarning: PostTagsWarningResolver,
    EditedPostTag: EditedPostTagResolver,
    DuplicatePostTagError: DuplicatePostTagErrorResolver,
    CreatePostTagsValidationError: CreatePostTagsValidationErrorResolver,
    DeletePostTagsValidationError: DeletePostTagsValidationErrorResolver,
    EditPostTagValidationError: EditPostTagValidationErrorResolver,
  },
};
