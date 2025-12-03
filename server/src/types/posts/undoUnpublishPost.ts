import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { PostFieldResolver } from ".";
import type { TestData } from "types/tests";

export type UndoUnpublishPost = PostFieldResolver<
  ResolverFunc<MutationResolvers["undoUnpublishPost"]>
>;

export type UndoUnpublishPostData = TestData<{
  undoUnpublishPost: Record<string, unknown>;
}>;
