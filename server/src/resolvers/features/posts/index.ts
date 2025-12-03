import getPost from "./getPost";
import getPosts from "./getPosts";

import createPost from "./createPost";
import draftPost from "./draftPost";
import deletePostContentImages from "./deletePostContentImages";
import editPost from "./editPost";
import unpublishPost from "./unpublishPost";
import undoUnpublishPost from "./undoUnpublishPost";
import binPosts from "./binPosts";
import binPost from "./binPost";
// import unBinPosts from "./unBinPosts";
// import deletePostsFromBin from "./deletePostsFromBin";
// import emptyBin from "./emptyBin";

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
    binPost,
    // unBinPosts,
    // deletePostsFromBin,
    // emptyBin,
  },
};
