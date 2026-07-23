import type { QueryResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";

export type GetPostTags = ResolverFunc<QueryResolvers["getPostTags"]>;

export type GetPostTagsData = TestData<{
  getPostTags: Record<string, unknown>;
}>;
