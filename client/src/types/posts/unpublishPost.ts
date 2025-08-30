import type { Mutation } from "@apiTypes";
import type { UnpublishedPostDataMapper } from ".";

export type UnpublishPostData = UnpublishedPostDataMapper<
  Pick<Mutation, "unpublishPost">
>;
