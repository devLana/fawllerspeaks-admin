import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import { binPostsRegex } from "@utils/posts/getPostsFieldsRegex";
import type { BinPostsData } from "types/posts/binPosts";
import type { PostStatus } from "@apiTypes";

type Update = (
  status: PostStatus | null | undefined
) => MutationBaseOptions<BinPostsData>["update"];

export const update: Update = status => {
  return (cache, { data }) => {
    if (!data) return;

    const { __typename } = data.binPosts;

    if (__typename !== "Posts" && __typename !== "PostsWarning") return;

    const regex = status
      ? binPostsRegex(status)
      : /^getPosts\(((?!.*?"status":"[^"]+")[^)]*)\)$/;

    const getPostsMap = buildGetPostsMap(cache, regex);

    getPostsMap.forEach(({ args }) => {
      cache.evict({ fieldName: "getPosts", args, broadcast: false });
    });
  };
};
