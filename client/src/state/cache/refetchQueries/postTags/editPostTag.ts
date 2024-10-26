import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import type { EditPostTagData } from "types/postTags/editPostTag";
import type { RefetchQueriesFn } from "@types";

type EditPostTagRefetchQueriesFn = RefetchQueriesFn<EditPostTagData>;

export const refetchQueries: EditPostTagRefetchQueriesFn = result => {
  if (
    result.data?.editPostTag.__typename === "UnknownError" ||
    result.data?.editPostTag.__typename === "EditedPostTag"
  ) {
    return [{ query: GET_POST_TAGS }];
  }

  return [];
};
