import { GET_POST_TAGS } from "@features/postTags/GetPostTags/operations/GET_POST_TAGS";
import type { EditPostTagData } from "@features/postTags/types";
import type { RefetchQueriesFn } from "@types";

type EditPostTagRefetchQueriesFn = RefetchQueriesFn<EditPostTagData>;

export const refetchQueries: EditPostTagRefetchQueriesFn = result => {
  if (result.data?.editPostTag.__typename === "EditedPostTag") {
    return [GET_POST_TAGS];
  }

  return [];
};
