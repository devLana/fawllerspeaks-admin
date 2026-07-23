import type {
  Posts,
  MutationResolvers as Resolvers,
} from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { PostFieldResolver } from ".";
import type { TestData } from "@appTypes/tests";

export type BinPosts = PostFieldResolver<ResolverFunc<Resolvers["binPosts"]>>;
export type BinPostsData = TestData<{ binPosts: Record<string, unknown> }>;
export type BinPostsSuccess = TestData<{ binPosts: Posts }>;
