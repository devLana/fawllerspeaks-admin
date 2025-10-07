import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import { getPostsFieldsRegex } from "@utils/posts/regex/getPostsFieldsRegex";
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

    const regex = getPostsFieldsRegex(status);
    const getPostsMap = buildGetPostsMap(cache, regex);

    getPostsMap.forEach(({ args }) => {
      cache.evict({ fieldName: "getPosts", args, broadcast: false });
    });

    // cache.gc()
  };
};
