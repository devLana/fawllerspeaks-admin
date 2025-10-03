import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import evictSubsequentGetPostsFieldsOnPosts from "@utils/posts/evictSubsequentGetPostsFieldsOnPosts";
import { getPostsFieldsRegex } from "@utils/posts/regex/getPostsFieldsRegex";
import type { BinPostData } from "types/posts/bin/binPost";
import type { QueryGetPostsArgs } from "@apiTypes";

type Update = (
  gqlVariables: QueryGetPostsArgs
) => MutationBaseOptions<BinPostData>["update"];

export const update: Update = gqlVariables => {
  return (cache, { data }) => {
    if (data?.binPost.__typename !== "SinglePost") return;

    const { url, status } = data.binPost.post;
    const regex = getPostsFieldsRegex(status);
    const getPostsMap = buildGetPostsMap(cache, regex);

    getPostsMap.forEach(({ args, fieldData }) => {
      evictSubsequentGetPostsFieldsOnPosts({
        cache,
        getPostsMap,
        args,
        fieldData,
        slug: url.slug,
        gqlVariables,
      });
    });
  };
};
