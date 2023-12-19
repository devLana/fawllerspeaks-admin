import type { Mutation } from "@apiTypes";
import type { PostTagsDataUnionMapper as Mapper } from "@types";

export type DeletePostTagsData = Mapper<Pick<Mutation, "deletePostTags">>;
