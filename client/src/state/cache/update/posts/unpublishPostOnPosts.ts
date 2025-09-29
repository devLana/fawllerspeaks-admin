import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import evictGetPostsFieldsOnPosts from "@utils/posts/evictGetPostsFieldsOnPosts";
import { unpublishPostRegex } from "@utils/posts/getPostsFieldsRegex";
import type { UnpublishPostData } from "types/posts/unpublish/unpublishPost";
import type { QueryGetPostsArgs } from "@apiTypes";

type Update = (
  gqlVariables: QueryGetPostsArgs
) => MutationBaseOptions<UnpublishPostData>["update"];

export const update: Update = gqlVariables => {
  return (cache, { data }) => {
    if (data?.unpublishPost.__typename !== "SinglePost") return;

    const { url } = data.unpublishPost.post;
    const getPostsMap = buildGetPostsMap(cache, unpublishPostRegex);

    getPostsMap.forEach(({ args, fieldData }) => {
      evictGetPostsFieldsOnPosts({
        args,
        cache,
        slug: url.slug,
        newStatus: "Unpublished",
        oldStatus: "Published",
        fieldData,
        getPostsMap,
        gqlVariables,
      });
    });
  };
};
