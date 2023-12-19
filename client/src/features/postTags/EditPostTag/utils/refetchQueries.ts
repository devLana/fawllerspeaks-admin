import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import type { EditPostTagData } from "../types";

type FunctionLike = (...args: never[]) => unknown;
type RefetchQueries = Extract<
  MutationBaseOptions<EditPostTagData>["refetchQueries"],
  FunctionLike
>;

export const refetchQueries: RefetchQueries = result => {
  if (result.data?.editPostTag.__typename === "EditedPostTag") {
    return ["GetPostTags"];
  }

  return [];
};
