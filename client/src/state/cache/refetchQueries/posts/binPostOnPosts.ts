import { GET_POSTS } from "@queries/getPosts/GET_POSTS";
import type { RefetchQueriesFn } from "@types";
import type { BinPostData } from "types/posts/bin/binPost";
import type { QueryGetPostsArgs } from "@apiTypes";

type BinPostRefetchQueriesFn = (
  gqlVariables: QueryGetPostsArgs
) => RefetchQueriesFn<BinPostData>;

export const refetchQueries: BinPostRefetchQueriesFn = gqlVariables => {
  return ({ data }) => {
    if (data?.binPost.__typename !== "SinglePost") return [];
    return [{ query: GET_POSTS, variables: gqlVariables }];
  };
};
