import { GET_POSTS } from "@queries/getPosts/GET_POSTS";
import type { RefetchQueriesFn } from "@types";
import type { BinPostsData } from "types/posts/binPosts";
import type { QueryGetPostsArgs } from "@apiTypes";

type BinPostRefetchQueriesFn = (
  gqlVariables: QueryGetPostsArgs
) => RefetchQueriesFn<BinPostsData>;

export const refetchQueries: BinPostRefetchQueriesFn = gqlVariables => {
  return ({ data }) => {
    if (data?.binPosts.__typename !== "Posts") return [];
    return [{ query: GET_POSTS, variables: gqlVariables }];
  };
};
