import type { Mutation } from "@apiTypes";
import type { PostTagsDataUnionMapper as Mapper } from "@types";

export type CreatePostTagsData = Mapper<Pick<Mutation, "createPostTags">>;
