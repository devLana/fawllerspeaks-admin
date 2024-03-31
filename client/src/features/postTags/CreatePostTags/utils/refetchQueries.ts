import type { CreatePostTagsData, RefetchQueriesFn } from "@types";

type CreatePostTagsRefetchQueriesFn = RefetchQueriesFn<CreatePostTagsData>;

export const refetchQueries: CreatePostTagsRefetchQueriesFn = result => {
  if (
    result.data?.createPostTags.__typename === "PostTags" ||
    result.data?.createPostTags.__typename === "CreatedPostTagsWarning"
  ) {
    return ["GetPostTags"];
  }

  return [];
};
