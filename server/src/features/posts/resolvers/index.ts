import getPost from "./getPost";
import getPosts from "./getPosts";

import createPost from "./createPost";
import editPost from "./editPost";
import draftPost from "./draftPost";
import publishPost from "./publishPost";
import unpublishPost from "./unpublishPost";
import binPosts from "./binPosts";
import unBinPosts from "./unBinPosts";
import deletePostsFromBin from "./deletePostsFromBin";
import emptyBin from "./emptyBin";

import {
  SinglePostResolver,
  PostsResolver,
  PostsWarningResolver,
  DuplicatePostTitleErrorResolver,
  NotAllowedPostActionErrorResolver,
  UnauthorizedAuthorErrorResolver,
  PostValidationErrorResolver,
  PostIdValidationErrorResolver,
  PostIdsValidationErrorResolver,
} from "./types";

import { EmptyBinWarningResolver } from "./emptyBin/EmptyBinWarning";
import { CreatePostValidationErrorResolver } from "./createPost/CreatePostValidationError";

import type {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
} from "@resolverTypes";
import type { ResolversMapper, ObjectMapper } from "@types";

type MutationsKeys =
  | "createPost"
  | "editPost"
  | "draftPost"
  | "publishPost"
  | "unpublishPost"
  | "binPosts"
  | "unBinPosts"
  | "deletePostsFromBin"
  | "emptyBin";

type TypeKeys =
  | "SinglePost"
  | "Posts"
  | "PostsWarning"
  | "EmptyBinWarning"
  | "DuplicatePostTitleError"
  | "NotAllowedPostActionError"
  | "UnauthorizedAuthorError"
  | "PostValidationError"
  | "PostIdValidationError"
  | "PostIdsValidationError"
  | "CreatePostValidationError";

interface PostsResolvers {
  Queries: ResolversMapper<Pick<QueryResolvers, "getPosts" | "getPost">>;
  Mutations: ResolversMapper<Pick<MutationResolvers, MutationsKeys>>;
  Types: ObjectMapper<Pick<Resolvers, TypeKeys>>;
}

export const postsResolvers: PostsResolvers = {
  Queries: {
    getPost,
    getPosts,
  },

  Mutations: {
    createPost,
    editPost,
    draftPost,
    publishPost,
    unpublishPost,
    binPosts,
    unBinPosts,
    deletePostsFromBin,
    emptyBin,
  },

  Types: {
    SinglePost: SinglePostResolver,
    Posts: PostsResolver,
    PostsWarning: PostsWarningResolver,
    EmptyBinWarning: EmptyBinWarningResolver,
    DuplicatePostTitleError: DuplicatePostTitleErrorResolver,
    NotAllowedPostActionError: NotAllowedPostActionErrorResolver,
    UnauthorizedAuthorError: UnauthorizedAuthorErrorResolver,
    PostValidationError: PostValidationErrorResolver,
    PostIdValidationError: PostIdValidationErrorResolver,
    PostIdsValidationError: PostIdsValidationErrorResolver,
    CreatePostValidationError: CreatePostValidationErrorResolver,
  },
};
