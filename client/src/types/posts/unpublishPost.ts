import type { Mutation } from "@apiTypes";
import type { PostDataMapper } from ".";

export type UnpublishPostData = PostDataMapper<Pick<Mutation, "unpublishPost">>;
