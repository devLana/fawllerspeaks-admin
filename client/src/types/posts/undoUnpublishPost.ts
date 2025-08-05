import type { Mutation } from "@apiTypes";
import type { PostDataMapper } from ".";

export type UndoUnpublishPostData = PostDataMapper<
  Pick<Mutation, "undoUnpublishPost">
>;
