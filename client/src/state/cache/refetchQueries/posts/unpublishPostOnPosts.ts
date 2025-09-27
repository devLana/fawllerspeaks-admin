import { GET_POSTS } from "@queries/getPosts/GET_POSTS";
import type { RefetchQueriesFn } from "@types";
import type { UnpublishPostData } from "types/posts/unpublishPost";
import type { QueryGetPostsArgs } from "@apiTypes";

type UnpublishPostRefetchQueriesFn = (
  gqlVariables: QueryGetPostsArgs
) => RefetchQueriesFn<UnpublishPostData>;

export const refetchQueries: UnpublishPostRefetchQueriesFn = gqlVariables => {
  return ({ data }) => {
    if (
      data?.unpublishPost.__typename === "NotAllowedPostActionError" ||
      data?.unpublishPost.__typename === "PostIdValidationError" ||
      data?.unpublishPost.__typename === "RegistrationError" ||
      data?.unpublishPost.__typename === "UnknownError" ||
      data?.unpublishPost.__typename === "SinglePost"
    ) {
      return [{ query: GET_POSTS, variables: gqlVariables }];
    }

    return [];
  };
};
