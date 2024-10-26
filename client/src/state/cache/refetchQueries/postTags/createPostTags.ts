import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import type { CreatePostTagsData } from "types/postTags/createPostTags";
import type { RefetchQueriesFn } from "@types";

type CreatePostTagsRefetchQueriesFn = RefetchQueriesFn<CreatePostTagsData>;

export const refetchQueries: CreatePostTagsRefetchQueriesFn = result => {
  if (
    result.data?.createPostTags.__typename === "PostTags" ||
    result.data?.createPostTags.__typename === "CreatedPostTagsWarning"
  ) {
    return [{ query: GET_POST_TAGS }];
  }

  return [];
};
