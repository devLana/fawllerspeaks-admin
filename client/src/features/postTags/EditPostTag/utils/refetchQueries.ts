import type { RefetchQueriesFn, EditPostTagData } from "@types";

type EditPostTagRefetchQueriesFn = RefetchQueriesFn<EditPostTagData>;

export const refetchQueries: EditPostTagRefetchQueriesFn = result => {
  if (result.data?.editPostTag.__typename === "EditedPostTag") {
    return ["GetPostTags"];
  }

  return [];
};
