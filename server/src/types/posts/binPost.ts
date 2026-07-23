import type {
  MutationResolvers as Resolvers,
  SinglePost,
} from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { PostFieldResolver } from ".";
import type { TestData } from "@appTypes/tests";

export type BinPost = PostFieldResolver<ResolverFunc<Resolvers["binPost"]>>;
export type BinPostData = TestData<{ binPost: Record<string, unknown> }>;
export type BinPostSuccess = TestData<{ binPost: SinglePost }>;

export interface BinPostCTE {
  is_registered: boolean;
  post: { id: number; binnedAt: string | null } | null;
}
