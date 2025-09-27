import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import { GET_CACHED_POSTS_NEXT_PAGE_DATA } from "@queries/getPosts/GET_CACHED_POSTS_NEXT_PAGE_DATA";
import { GET_CACHED_POSTS } from "@queries/getPosts/GET_CACHED_POSTS";
import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import objectsAreEqual from "@utils/posts/objectsAreEqual";
import type { UnpublishPostData } from "types/posts/unpublishPost";
import type { QueryGetPostsArgs } from "@apiTypes";

type Update = (
  gqlVariables: QueryGetPostsArgs
) => MutationBaseOptions<UnpublishPostData>["update"];

export const update: Update = gqlVariables => {
  return (cache, { data }) => {
    if (data?.unpublishPost.__typename !== "SinglePost") return;

    const { url } = data.unpublishPost.post;
    const getPostsMap = buildGetPostsMap(cache);

    getPostsMap.forEach(({ args, fieldData }) => {
      if (args.status === "Unpublished") {
        cache.evict({ fieldName: "getPosts", args, broadcast: false });
      } else if (args.status === "Published") {
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
          /* remove the modified post from the current active field and page */
          cache.updateQuery(
            { query: GET_CACHED_POSTS, variables: args },
            cachedData => {
              if (!cachedData) return;

              return {
                getPosts: {
                  ...cachedData.getPosts,
                  posts: cachedData.getPosts.posts.filter(post => {
                    return post.url.slug !== url.slug;
                  }),
                },
              };
            }
          );

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
      }
    });
  };
};
