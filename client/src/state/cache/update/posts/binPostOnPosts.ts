import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import { GET_CACHED_POSTS_NEXT_PAGE_DATA } from "@queries/getPosts/GET_CACHED_POSTS_NEXT_PAGE_DATA";
import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import objectsAreEqual from "@utils/posts/objectsAreEqual";
import type { BinPostsData } from "types/posts/binPosts";
import type { QueryGetPostsArgs } from "@apiTypes";

type Update = (
  gqlVariables: QueryGetPostsArgs
) => MutationBaseOptions<BinPostsData>["update"];

export const update: Update = gqlVariables => {
  return (cache, { data }) => {
    if (data?.binPosts.__typename !== "Posts") return;

    const [{ url }] = data.binPosts.posts;
    const getPostsMap = buildGetPostsMap(cache);

    if (getPostsMap.size === 0) return;

    getPostsMap.forEach(({ args, fieldData }) => {
      const hasPost = fieldData.posts.some(postRef => {
        return postRef.__ref === `Post:{"url":{"slug":"${url.slug}"}}`;
      });

      if (!hasPost) return;

      const gqlVariablesCopy = { ...gqlVariables };
      const currentArgs: QueryGetPostsArgs = { ...args };
      let nextCursor: string | null = null;

      if (!gqlVariablesCopy.size) {
        gqlVariablesCopy.size = 12;
      }

      if (!gqlVariablesCopy.sort) {
        gqlVariablesCopy.sort = "date_desc";
      }

      if (objectsAreEqual(gqlVariablesCopy, args)) {
        if (!fieldData.pageData.next) return;

        currentArgs.after = fieldData.pageData.next;
      }

      do {
        const page = cache.readQuery({
          query: GET_CACHED_POSTS_NEXT_PAGE_DATA,
          variables: currentArgs,
        });

        nextCursor = page?.getPosts.pageData.next ?? null;

        const hasEvicted = cache.evict({
          fieldName: "getPosts",
          args: currentArgs,
          broadcast: false,
        });

        if (hasEvicted) getPostsMap.delete(JSON.stringify(currentArgs));

        if (nextCursor) {
          currentArgs.after = nextCursor;
        }
      } while (nextCursor);
    });
  };
};
