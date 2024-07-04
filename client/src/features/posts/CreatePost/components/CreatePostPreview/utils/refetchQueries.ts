import { GET_POST_TAGS } from "@hooks/useGetPostTags";
import type { CreatePostGQLData, RefetchQueriesFn } from "@types";

type CreatePostRefetchQueriesFn = RefetchQueriesFn<CreatePostGQLData>;

export const refetchQueries: CreatePostRefetchQueriesFn = result => {
  if (result.data?.createPost.__typename === "UnknownError") {
    return [{ query: GET_POST_TAGS }];
  }

  return [];
};
