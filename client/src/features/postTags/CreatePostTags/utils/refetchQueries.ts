import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import type { Mutation } from "@apiTypes";

type FunctionLike = (...args: never[]) => unknown;
type RefetchQueries = Extract<
  MutationBaseOptions<Pick<Mutation, "createPostTags">>["refetchQueries"],
  FunctionLike
>;

export const refetchQueries: RefetchQueries = result => {
  if (
    result.data?.createPostTags.__typename === "PostTags" ||
    result.data?.createPostTags.__typename === "PostTagsWarning"
  ) {
    return ["GetPostTags"];
  }

  return [];
};
