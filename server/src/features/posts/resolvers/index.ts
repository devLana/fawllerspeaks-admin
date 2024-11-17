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
import deletePostContentImages from "./deletePostContentImages";

import { PostResolvers } from "./types/Post";
import { PostAuthorResolvers } from "./types/PostAuthor";
import { PostUrlResolvers } from "./types/PostUrl";
import { SinglePostResolver } from "./types/SinglePost";
import { PostsResolver } from "./types/Posts";
import { GetPostWarningResolvers } from "./getPost/types/GetPostWarning";
import { PostsWarningResolver } from "./types/PostsWarning";
import { DuplicatePostTitleErrorResolver } from "./types/DuplicatePostTitleError";
import { NotAllowedPostActionErrorResolver } from "./types/NotAllowedPostActionError";
import { UnauthorizedAuthorErrorResolver } from "./types/UnauthorizedAuthorError";
import { PostValidationErrorResolver } from "./types/PostValidationError";
import { PostIdValidationErrorResolver } from "./types/PostIdValidationError";
import { PostIdsValidationErrorResolver } from "./types/PostIdsValidationError";

import { EmptyBinWarningResolver } from "./emptyBin/EmptyBinWarning";
import { EditPostValidationErrorResolver } from "./editPost/types/EditPostValidationError";
import { GetPostsDataResolvers } from "./getPosts/types/GetPostsData";
import { GetPostsValidationErrorResolvers } from "./getPosts/types/GetPostsValidationError";
import { GetPostValidationErrorResolvers } from "./getPost/types/GetPostValidationError";
import { DeletePostContentImagesValidationErrorResolvers as DeletePostImagesResolvers } from "./deletePostContentImages/types/DeletePostContentImagesValidationError";

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
  | "emptyBin"
  | "deletePostContentImages";

type TypeKeys =
  | "Post"
  | "PostAuthor"
  | "PostUrl"
  | "SinglePost"
  | "Posts"
  | "GetPostsData"
  | "GetPostWarning"
  | "PostsWarning"
  | "EmptyBinWarning"
  | "DuplicatePostTitleError"
  | "NotAllowedPostActionError"
  | "UnauthorizedAuthorError"
  | "PostValidationError"
  | "PostIdValidationError"
  | "PostIdsValidationError"
  | "EditPostValidationError"
  | "GetPostsValidationError"
  | "GetPostValidationError"
  | "DeletePostContentImagesValidationError";

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
    deletePostContentImages,
  },

  Types: {
    Post: PostResolvers,
    PostAuthor: PostAuthorResolvers,
    PostUrl: PostUrlResolvers,
    SinglePost: SinglePostResolver,
    Posts: PostsResolver,
    GetPostsData: GetPostsDataResolvers,
    GetPostWarning: GetPostWarningResolvers,
    PostsWarning: PostsWarningResolver,
    EmptyBinWarning: EmptyBinWarningResolver,
    DuplicatePostTitleError: DuplicatePostTitleErrorResolver,
    NotAllowedPostActionError: NotAllowedPostActionErrorResolver,
    UnauthorizedAuthorError: UnauthorizedAuthorErrorResolver,
    PostValidationError: PostValidationErrorResolver,
    PostIdValidationError: PostIdValidationErrorResolver,
    PostIdsValidationError: PostIdsValidationErrorResolver,
    EditPostValidationError: EditPostValidationErrorResolver,
    GetPostsValidationError: GetPostsValidationErrorResolvers,
    GetPostValidationError: GetPostValidationErrorResolvers,
    DeletePostContentImagesValidationError: DeletePostImagesResolvers,
  },
};
