import type { MutationResolvers as Resolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { PostFieldResolver } from ".";
import type { TestData } from "@appTypes/tests";

export type UnpublishPost = PostFieldResolver<
  ResolverFunc<Resolvers["unpublishPost"]>
>;

export type UnpublishPostData = TestData<{
  unpublishPost: Record<string, unknown>;
}>;
