import type { UndoUnpublishPostData as Data } from "types/posts/unpublish/undoUnpublishPost";
import type { OptimisticResponseFn } from "@types";
import type { MutationUndoUnpublishPostArgs as Args } from "@apiTypes";

type OptimisticResponse = (slug: string) => OptimisticResponseFn<Data, Args>;

export const optimisticResponse: OptimisticResponse = slug => {
  return ({ postId: id }) => ({
    undoUnpublishPost: {
      __typename: "SinglePost",
      post: { __typename: "Post", id, status: "Published", url: { slug } },
    },
  });
};
