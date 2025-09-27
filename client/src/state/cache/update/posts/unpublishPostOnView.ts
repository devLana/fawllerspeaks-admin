import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import { GET_CACHED_POSTS_NEXT_PAGE_DATA } from "@queries/getPosts/GET_CACHED_POSTS_NEXT_PAGE_DATA";
import { POST_STATUS } from "@fragments/POST_STATUS";
import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import type { UnpublishPostData } from "types/posts/unpublishPost";
import type { QueryGetPostsArgs } from "@apiTypes";

type Update = (
  slug: string
) => MutationBaseOptions<UnpublishPostData>["update"];

export const update: Update = slug => {
  return (cache, { data }) => {
    if (
      data?.unpublishPost.__typename === "RegistrationError" ||
      data?.unpublishPost.__typename === "PostIdValidationError" ||
      data?.unpublishPost.__typename === "NotAllowedPostActionError" ||
      data?.unpublishPost.__typename === "UnknownError"
    ) {
      cache.writeFragment({
        id: cache.identify({ __typename: "Post", url: { slug } }),
        fragment: POST_STATUS,
        data: { __typename: "Post", status: "Published" },
      });

      return;
    }

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

        const currentArgs: QueryGetPostsArgs = { ...args };
        let nextCursor: string | null = null;

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
