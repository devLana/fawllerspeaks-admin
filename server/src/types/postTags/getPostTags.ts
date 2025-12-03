import type { QueryResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type GetPostTags = ResolverFunc<QueryResolvers["getPostTags"]>;

export type GetPostTagsData = TestData<{
  getPostTags: Record<string, unknown>;
}>;
