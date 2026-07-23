import type { MutationResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { PostFieldResolver } from ".";
import type { TestData } from "@appTypes/tests";

export type UndoUnpublishPost = PostFieldResolver<
  ResolverFunc<MutationResolvers["undoUnpublishPost"]>
>;

export type UndoUnpublishPostData = TestData<{
  undoUnpublishPost: Record<string, unknown>;
}>;
