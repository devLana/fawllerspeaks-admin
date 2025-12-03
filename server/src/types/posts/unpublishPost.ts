import type { MutationResolvers as Resolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { PostFieldResolver } from ".";
import type { TestData } from "types/tests";

export type UnpublishPost = PostFieldResolver<
  ResolverFunc<Resolvers["unpublishPost"]>
>;

export type UnpublishPostData = TestData<{
  unpublishPost: Record<string, unknown>;
}>;
