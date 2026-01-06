import type { MutationResolvers as Resolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { PostFieldResolver } from ".";
import type { TestData } from "types/tests";

export type BinPost = PostFieldResolver<ResolverFunc<Resolvers["binPost"]>>;
export type BinPostData = TestData<{ binPost: Record<string, unknown> }>;

export interface BinPostCTE {
  is_registered: boolean;
  post: { id: number; binnedAt: string | null } | null;
}
