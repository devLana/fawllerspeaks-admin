import getPost from "./getPost";
import getPosts from "./getPosts";

import createPost from "./createPost";
import draftPost from "./draftPost";
import deletePostContentImages from "./deletePostContentImages";
import editPost from "./editPost";
import unpublishPost from "./unpublishPost";
import undoUnpublishPost from "./undoUnpublishPost";
import binPosts from "./binPosts";
// import unBinPosts from "./unBinPosts";
// import deletePostsFromBin from "./deletePostsFromBin";
// import emptyBin from "./emptyBin";

import { PostResolvers } from "./types/Post";
import { PostAuthorResolvers } from "./types/PostAuthor";
import { PostUrlResolvers } from "./types/PostUrl";
import { SinglePostResolver } from "./types/SinglePost";
import { PostsResolver } from "./types/Posts";
import { GetPostWarningResolvers } from "./getPost/types/GetPostWarning";
import { PostsWarningResolver } from "./types/PostsWarning";
import { DuplicatePostTitleErrorResolver } from "./types/DuplicatePostTitleError";
import { NotAllowedPostActionErrorResolver } from "./types/NotAllowedPostActionError";
// import { UnauthorizedAuthorErrorResolver } from "./types/UnauthorizedAuthorError";
import { PostValidationErrorResolver } from "./types/PostValidationError";
import { PostIdValidationErrorResolver } from "./types/PostIdValidationError";
import { PostIdsValidationErrorResolver } from "./types/PostIdsValidationError";

// import { EmptyBinWarningResolver } from "./emptyBin/EmptyBinWarning";
import { EditPostValidationErrorResolver } from "./editPost/types/EditPostValidationError";
import { GetPostsDataResolvers } from "./getPosts/types/GetPostsData";
import { GetPostsValidationErrorResolvers } from "./getPosts/types/GetPostsValidationError";
import { GetPostValidationErrorResolvers } from "./getPost/types/GetPostValidationError";
import { DeletePostContentImagesValidationErrorResolvers as DeletePostImagesResolvers } from "./deletePostContentImages/types/DeletePostContentImagesValidationError";

export const postsResolvers = {
  Queries: { getPost, getPosts },

  Mutations: {
    createPost,
    draftPost,
    deletePostContentImages,
    editPost,
    unpublishPost,
    undoUnpublishPost,
    binPosts,
    // unBinPosts,
    // deletePostsFromBin,
    // emptyBin,
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
    // EmptyBinWarning: EmptyBinWarningResolver,
    DuplicatePostTitleError: DuplicatePostTitleErrorResolver,
    NotAllowedPostActionError: NotAllowedPostActionErrorResolver,
    // UnauthorizedAuthorError: UnauthorizedAuthorErrorResolver,
    PostValidationError: PostValidationErrorResolver,
    PostIdValidationError: PostIdValidationErrorResolver,
    PostIdsValidationError: PostIdsValidationErrorResolver,
    EditPostValidationError: EditPostValidationErrorResolver,
    GetPostsValidationError: GetPostsValidationErrorResolvers,
    GetPostValidationError: GetPostValidationErrorResolvers,
    DeletePostContentImagesValidationError: DeletePostImagesResolvers,
  },
};
