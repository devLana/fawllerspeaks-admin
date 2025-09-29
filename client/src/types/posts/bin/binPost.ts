import type { Mutation } from "@apiTypes";
import type { BinnedPostDataMapper } from "./bin";

export type BinPostData = BinnedPostDataMapper<Pick<Mutation, "binPost">>;
