import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import evictGetPostsFieldsOnPosts from "@utils/posts/evictGetPostsFieldsOnPosts";
import { unpublishPostRegex } from "@utils/posts/regex/unpublishPostRegex";
import type { UndoUnpublishPostData } from "types/posts/unpublish/undoUnpublishPost";
import type { QueryGetPostsArgs } from "@apiTypes";

type Update = (
  gqlVariables: QueryGetPostsArgs
) => MutationBaseOptions<UndoUnpublishPostData>["update"];

export const update: Update = gqlVariables => {
  return (cache, { data }) => {
    if (data?.undoUnpublishPost.__typename !== "SinglePost") return;

    const { url } = data.undoUnpublishPost.post;
    const getPostsMap = buildGetPostsMap(cache, unpublishPostRegex);

    getPostsMap.forEach(({ args, fieldData }) => {
      evictGetPostsFieldsOnPosts({
        args,
        cache,
        slug: url.slug,
        newStatus: "Published",
        oldStatus: "Unpublished",
        fieldData,
        getPostsMap,
        gqlVariables,
      });
    });
  };
};
