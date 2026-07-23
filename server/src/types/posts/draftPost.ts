import type { MutationResolvers, SinglePost } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { PostFieldResolver } from ".";
import type { TestData } from "@appTypes/tests";

export type DraftPost = PostFieldResolver<
  ResolverFunc<MutationResolvers["draftPost"]>
>;

export type DraftData = TestData<{ draftPost: Record<string, unknown> }>;
export type Drafted = TestData<{ draftPost: SinglePost }>;
