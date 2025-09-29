import type { Mutation } from "@apiTypes";
import type { UnpublishedPostDataMapper } from "./unpublish";

export type UnpublishPostData = UnpublishedPostDataMapper<
  Pick<Mutation, "unpublishPost">
>;
