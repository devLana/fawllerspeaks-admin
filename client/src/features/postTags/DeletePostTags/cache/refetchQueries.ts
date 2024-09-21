import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import type { DeletePostTagsData } from "types/postTags";
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
