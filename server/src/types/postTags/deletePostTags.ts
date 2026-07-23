import type { MutationResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";

export type DeletePostTags = ResolverFunc<MutationResolvers["deletePostTags"]>;
export type DeleteTags = TestData<{ deletePostTags: Record<string, unknown> }>;

export interface Del {
  id: string;
  name: string;
}
