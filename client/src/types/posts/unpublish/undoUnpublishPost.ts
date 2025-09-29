import type { Mutation } from "@apiTypes";
import type { UnpublishedPostDataMapper } from "./unpublish";

export type UndoUnpublishPostData = UnpublishedPostDataMapper<
  Pick<Mutation, "undoUnpublishPost">
>;
