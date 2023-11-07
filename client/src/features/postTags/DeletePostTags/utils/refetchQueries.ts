import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import type { Mutation } from "@apiTypes";

type FunctionLike = (...args: never[]) => unknown;
type RefetchQueries = Extract<
  MutationBaseOptions<Pick<Mutation, "deletePostTags">>["refetchQueries"],
  FunctionLike
>;

export const refetchQueries: RefetchQueries = ({ data }) => {
  if (
    data?.deletePostTags.__typename === "DeletePostTagsValidationError" ||
    data?.deletePostTags.__typename === "UnknownError" ||
    data?.deletePostTags.__typename === "PostTagsWarning"
  ) {
    return ["GetPostTags"];
  }

  return [];
};
