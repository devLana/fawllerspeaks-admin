import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import evictGetPostsFields from "@utils/posts/evictGetPostsFields";
import type { BinPostsData } from "types/posts/bin/binPosts";
import type { PostStatus } from "@apiTypes";

type Update = (
  status: PostStatus | null | undefined
) => MutationBaseOptions<BinPostsData>["update"];

export const update: Update = status => {
  return (cache, { data }) => {
    if (!data) return;

    const { __typename } = data.binPosts;

    if (__typename !== "Posts" && __typename !== "PostsWarning") return;

    if (!status) {
      cache.evict({ fieldName: "getPosts", broadcast: false });
      // cache.gc()
      return;
    }

    evictGetPostsFields(cache, status);
  };
};
