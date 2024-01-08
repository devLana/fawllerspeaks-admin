import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import type { CreatePostTagsData } from "@types";

type FunctionLike = (...args: never[]) => unknown;
type RefetchQueries = Extract<
  MutationBaseOptions<CreatePostTagsData>["refetchQueries"],
  FunctionLike
>;

export const refetchQueries: RefetchQueries = result => {
  if (
    result.data?.createPostTags.__typename === "PostTags" ||
    result.data?.createPostTags.__typename === "CreatedPostTagsWarning"
  ) {
    return ["GetPostTags"];
  }

  return [];
};
