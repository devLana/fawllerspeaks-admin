import type { DeletePostTagsData, RefetchQueriesFn } from "@types";

type DeletePostTagRefetchQueriesFn = RefetchQueriesFn<DeletePostTagsData>;

export const refetchQueries: DeletePostTagRefetchQueriesFn = ({ data }) => {
  if (
    data?.deletePostTags.__typename === "DeletePostTagsValidationError" ||
    data?.deletePostTags.__typename === "UnknownError" ||
    data?.deletePostTags.__typename === "DeletedPostTagsWarning"
  ) {
    return ["GetPostTags"];
  }

  return [];
};
