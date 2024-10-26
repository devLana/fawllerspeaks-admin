import type { Mutation } from "@apiTypes";
import type { PostTagDataMapper } from ".";

export type CreatePostTagsData = PostTagDataMapper<
  Pick<Mutation, "createPostTags">
>;
