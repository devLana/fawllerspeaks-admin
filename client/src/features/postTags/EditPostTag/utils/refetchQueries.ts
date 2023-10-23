import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import type { Mutation } from "@apiTypes";

type FunctionLike = (...args: never[]) => unknown;
type RefetchQueries = Extract<
  MutationBaseOptions<Pick<Mutation, "editPostTag">>["refetchQueries"],
  FunctionLike
>;

export const refetchQueries: RefetchQueries = result => {
  if (result.data?.editPostTag.__typename === "EditedPostTag") {
    return ["GetPostTags"];
  }

  return [];
};
