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

import { PostResolvers } from "./types/Post";
import { PostAuthorResolvers } from "./types/PostAuthor";
import { SinglePostResolver } from "./types/SinglePost";
import { PostsResolver } from "./types/Posts";
import { PostsWarningResolver } from "./types/PostsWarning";
import { DuplicatePostTitleErrorResolver } from "./types/DuplicatePostTitleError";
import { NotAllowedPostActionErrorResolver } from "./types/NotAllowedPostActionError";
import { UnauthorizedAuthorErrorResolver } from "./types/UnauthorizedAuthorError";
import { PostValidationErrorResolver } from "./types/PostValidationError";
import { PostIdValidationErrorResolver } from "./types/PostIdValidationError";
import { PostIdsValidationErrorResolver } from "./types/PostIdsValidationError";

import { EmptyBinWarningResolver } from "./emptyBin/EmptyBinWarning";
import { EditPostValidationErrorResolver } from "./editPost/types/EditPostValidationError";

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
  | "Post"
  | "PostAuthor"
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
  | "EditPostValidationError";

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
    Post: PostResolvers,
    PostAuthor: PostAuthorResolvers,
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
    EditPostValidationError: EditPostValidationErrorResolver,
  },
};
