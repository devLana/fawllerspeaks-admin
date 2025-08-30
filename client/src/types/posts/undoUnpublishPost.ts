import type { Mutation } from "@apiTypes";
import type { UnpublishedPostDataMapper } from ".";

export type UndoUnpublishPostData = UnpublishedPostDataMapper<
  Pick<Mutation, "undoUnpublishPost">
>;
