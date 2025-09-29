import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import evictSubsequentGetPostsFieldsOnView from "@utils/posts/evictSubsequentGetPostsFieldsOnView";
import type { BinPostsData } from "types/posts/binPosts";

type Update = MutationBaseOptions<BinPostsData>["update"];

export const update: Update = (cache, { data }) => {
  if (data?.binPosts.__typename !== "Posts") return;

  const [{ url }] = data.binPosts.posts;
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
