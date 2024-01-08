import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import type { DeletePostTagsData } from "@types";

type FunctionLike = (...args: never[]) => unknown;
type RefetchQueries = Extract<
  MutationBaseOptions<DeletePostTagsData>["refetchQueries"],
  FunctionLike
>;

export const refetchQueries: RefetchQueries = ({ data }) => {
  if (
    data?.deletePostTags.__typename === "DeletePostTagsValidationError" ||
    data?.deletePostTags.__typename === "UnknownError" ||
    data?.deletePostTags.__typename === "DeletedPostTagsWarning"
  ) {
    return ["GetPostTags"];
  }

  return [];
};
