import { GET_POST_TAGS } from "@hooks/useGetPostTags";
import type { DraftPostData, RefetchQueriesFn } from "@types";

type DraftPostRefetchQueriesFn = RefetchQueriesFn<DraftPostData>;

export const refetchQueries: DraftPostRefetchQueriesFn = result => {
  if (result.data?.draftPost.__typename === "UnknownError") {
    return [{ query: GET_POST_TAGS }];
  }

  return [];
};
