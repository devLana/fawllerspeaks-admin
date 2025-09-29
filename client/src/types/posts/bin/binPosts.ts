import type { Mutation } from "@apiTypes";
import type { BinnedPostDataMapper } from "./bin";

export type BinPostsData = BinnedPostDataMapper<Pick<Mutation, "binPosts">>;
