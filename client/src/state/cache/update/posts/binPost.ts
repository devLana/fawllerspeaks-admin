import type { Reference } from "@apollo/client";
import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import type { BinPostsData } from "types/posts/binPosts";

type Update = MutationBaseOptions<BinPostsData>["update"];

interface PostsRef {
  __typename?: "Posts";
  posts: Reference[];
}

interface CachedPosts {
  getPosts: PostsRef;
}

export const update: Update = (cache, { data }) => {
  if (
    data?.binPosts.__typename === "Posts" ||
    data?.binPosts.__typename === "PostsWarning"
  ) {
    const postIds = data.binPosts.posts.map(post => post.id);
    const deletedPostIdsSet = new Set(postIds);

    cache.modify<CachedPosts>({
      fields: {
        getPosts(getPostsRef, { readField }) {
          const posts = (getPostsRef as PostsRef).posts.filter(postRef => {
            const id = readField("id", postRef);

            if (typeof id !== "string") return false;

            return !deletedPostIdsSet.has(id);
          });

          return { ...getPostsRef, posts };
        },
      },
    });
  }
};
