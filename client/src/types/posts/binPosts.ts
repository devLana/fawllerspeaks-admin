import type { Mutation } from "@apiTypes";
import type { PostDataMapper } from ".";

export type BinPostsData = PostDataMapper<Pick<Mutation, "binPosts">>;
