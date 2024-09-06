import { GET_POST_TAGS } from "@features/postTags/GetPostTags/operations/GET_POST_TAGS";
import type { CreatePostTagsData } from "@features/postTags/types";
import type { RefetchQueriesFn } from "@types";

type CreatePostTagsRefetchQueriesFn = RefetchQueriesFn<CreatePostTagsData>;

export const refetchQueries: CreatePostTagsRefetchQueriesFn = result => {
  if (
    result.data?.createPostTags.__typename === "PostTags" ||
    result.data?.createPostTags.__typename === "CreatedPostTagsWarning"
  ) {
    return [GET_POST_TAGS];
  }

  return [];
};
