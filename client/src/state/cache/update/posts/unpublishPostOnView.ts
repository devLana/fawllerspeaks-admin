import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import { POST_STATUS } from "@fragments/POST_STATUS";
import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import evictGetPostsFieldsOnView from "@utils/posts/evictGetPostsFieldsOnView";
import { unpublishPostRegex } from "@utils/posts/getPostsFieldsRegex";
import type { UnpublishPostData } from "types/posts/unpublishPost";

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
    const getPostsMap = buildGetPostsMap(cache, unpublishPostRegex);

    if (getPostsMap.size === 0) return;

    getPostsMap.forEach(({ args, fieldData }) => {
      evictGetPostsFieldsOnView({
        args,
        cache,
        slug: url.slug,
        newStatus: "Unpublished",
        oldStatus: "Published",
        fieldData,
        getPostsMap,
      });
    });
  };
};
