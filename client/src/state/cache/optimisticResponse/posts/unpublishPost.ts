import type { UnpublishPostData as Data } from "types/posts/unpublishPost";
import type { PostData } from "types/posts";
import type { OptimisticResponseFn } from "@types";
import type { MutationUnpublishPostArgs as Args } from "@apiTypes";

type OptimisticResponse = OptimisticResponseFn<Data, Args>;

export const optimisticResponse: OptimisticResponse = vars => ({
  unpublishPost: {
    __typename: "SinglePost",
    post: { id: vars.postId, status: "Unpublished" } as PostData,
  },
});
