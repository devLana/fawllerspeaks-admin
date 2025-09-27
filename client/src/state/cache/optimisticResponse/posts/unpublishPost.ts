import type { UnpublishPostData as Data } from "types/posts/unpublishPost";
import type { OptimisticResponseFn } from "@types";
import type { MutationUnpublishPostArgs as Args } from "@apiTypes";

type OptimisticResponse = (slug: string) => OptimisticResponseFn<Data, Args>;

export const optimisticResponse: OptimisticResponse = slug => {
  return ({ postId: id }) => ({
    unpublishPost: {
      __typename: "SinglePost",
      post: { __typename: "Post", id, status: "Unpublished", url: { slug } },
    },
  });
};
