import type { Mutation } from "@apiTypes";
import type { PostTagDataMapper as Mapper } from ".";

export type CreatePostTagsData = Mapper<Pick<Mutation, "createPostTags">>;
