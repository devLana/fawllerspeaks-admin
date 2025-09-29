import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import { POST_STATUS } from "@fragments/POST_STATUS";
import buildGetPostsMap from "@utils/posts/buildGetPostsMap";
import evictGetPostsFieldsOnView from "@utils/posts/evictGetPostsFieldsOnView";
import { unpublishPostRegex } from "@utils/posts/getPostsFieldsRegex";
import type { UndoUnpublishPostData } from "types/posts/unpublish/undoUnpublishPost";

type Update = (
  slug: string
) => MutationBaseOptions<UndoUnpublishPostData>["update"];

export const update: Update = slug => {
  return (cache, { data }) => {
    if (
      data?.undoUnpublishPost.__typename === "RegistrationError" ||
      data?.undoUnpublishPost.__typename === "PostIdValidationError" ||
      data?.undoUnpublishPost.__typename === "NotAllowedPostActionError" ||
      data?.undoUnpublishPost.__typename === "UnknownError"
    ) {
      cache.writeFragment({
        id: cache.identify({ __typename: "Post", url: { slug } }),
        fragment: POST_STATUS,
        data: { __typename: "Post", status: "Unpublished" },
      });

      return;
    }

    if (data?.undoUnpublishPost.__typename !== "SinglePost") return;

    const { url } = data.undoUnpublishPost.post;
    const getPostsMap = buildGetPostsMap(cache, unpublishPostRegex);

    if (getPostsMap.size === 0) return;

    getPostsMap.forEach(({ args, fieldData }) => {
      evictGetPostsFieldsOnView({
        args,
        cache,
        slug: url.slug,
        newStatus: "Published",
        oldStatus: "Unpublished",
        fieldData,
        getPostsMap,
      });
    });
  };
};
