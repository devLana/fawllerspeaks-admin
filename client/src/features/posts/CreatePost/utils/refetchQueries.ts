import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import type { DraftPostData } from "@types";

type FunctionLike = (...args: never[]) => unknown;
type RefetchQueries = Extract<
  MutationBaseOptions<DraftPostData>["refetchQueries"],
  FunctionLike
>;

export const refetchQueries: RefetchQueries = result => {
  if (result.data?.draftPost.__typename === "UnknownError") {
    return ["GetPostTags"];
  }

  return [];
};
