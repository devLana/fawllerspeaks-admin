import type { MutationResolvers as Resolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { PostFieldResolver } from ".";
import type { TestData } from "types/tests";

export type BinPosts = PostFieldResolver<ResolverFunc<Resolvers["binPosts"]>>;
export type BinPostsData = TestData<{ binPosts: Record<string, unknown> }>;
