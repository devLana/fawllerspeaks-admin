import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import evictSubsequentGetPostsFieldsOnView from "@utils/posts/evictSubsequentGetPostsFieldsOnView";
import type { BinPostData } from "types/posts/bin/binPost";

type Update = MutationBaseOptions<BinPostData>["update"];

export const update: Update = (cache, { data }) => {
  if (data?.binPost.__typename !== "SinglePost") return;

  const { url } = data.binPost.post;
  const getPostsMap = buildGetPostsMap(cache, /^getPosts\((.*?)\)$/);

  if (getPostsMap.size === 0) return;

  getPostsMap.forEach(({ args, fieldData }) => {
    evictSubsequentGetPostsFieldsOnView({
      cache,
      getPostsMap,
      args,
      fieldData,
      slug: url.slug,
    });
  });
};
