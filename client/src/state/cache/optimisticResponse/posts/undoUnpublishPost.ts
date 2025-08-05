import type { UndoUnpublishPostData as Data } from "types/posts/undoUnpublishPost";
import type { PostData } from "types/posts";
import type { OptimisticResponseFn } from "@types";
import type { MutationUndoUnpublishPostArgs as Args } from "@apiTypes";

type OptimisticResponse = OptimisticResponseFn<Data, Args>;

export const optimisticResponse: OptimisticResponse = vars => ({
  undoUnpublishPost: {
    __typename: "SinglePost",
    post: { id: vars.postId, status: "Published" } as PostData,
  },
});
