import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import evictSubsequentGetPostsFieldsOnPosts from "@utils/posts/evictSubsequentGetPostsFieldsOnPosts";
import { binPostsRegex } from "@utils/posts/getPostsFieldsRegex";
import type { BinPostsData } from "types/posts/binPosts";
import type { QueryGetPostsArgs } from "@apiTypes";

type Update = (
  gqlVariables: QueryGetPostsArgs
) => MutationBaseOptions<BinPostsData>["update"];

export const update: Update = gqlVariables => {
  return (cache, { data }) => {
    if (data?.binPosts.__typename !== "Posts") return;

    const [{ url, status }] = data.binPosts.posts;
    const regex = binPostsRegex(status);
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
