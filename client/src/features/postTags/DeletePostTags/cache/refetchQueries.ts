import { GET_POST_TAGS } from "@features/postTags/GetPostTags/operations/GET_POST_TAGS";
import type { DeletePostTagsData } from "@features/postTags/types";
import type { RefetchQueriesFn } from "@types";

type DeletePostTagRefetchQueriesFn = RefetchQueriesFn<DeletePostTagsData>;

export const refetchQueries: DeletePostTagRefetchQueriesFn = ({ data }) => {
  if (
    data?.deletePostTags.__typename === "DeletePostTagsValidationError" ||
    data?.deletePostTags.__typename === "UnknownError" ||
    data?.deletePostTags.__typename === "DeletedPostTagsWarning"
  ) {
    return [GET_POST_TAGS];
  }

  return [];
};
