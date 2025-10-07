import { GET_POSTS } from "@queries/getPosts/GET_POSTS";
import type { RefetchQueriesFn } from "@types";
import type { UndoUnpublishPostData } from "types/posts/unpublish/undoUnpublishPost";
import type { QueryGetPostsArgs } from "@apiTypes";

type UndoUnpublishPostRefetchQueriesFn = (
  variables: QueryGetPostsArgs
) => RefetchQueriesFn<UndoUnpublishPostData>;

export const refetchQueries: UndoUnpublishPostRefetchQueriesFn = variables => {
  return ({ data }) => {
    if (
      data?.undoUnpublishPost.__typename === "NotAllowedPostActionError" ||
      data?.undoUnpublishPost.__typename === "PostIdValidationError" ||
      data?.undoUnpublishPost.__typename === "RegistrationError" ||
      data?.undoUnpublishPost.__typename === "UnknownError" ||
      (data?.undoUnpublishPost.__typename === "SinglePost" && variables.status)
    ) {
      return [{ query: GET_POSTS, variables }];
    }

    return [];
  };
};
