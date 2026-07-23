import type { MutationResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";

export type Delete = ResolverFunc<MutationResolvers["deletePostContentImages"]>;
export type Result = () => Promise<{ error: string | null }>;

export type DeleteData = TestData<{
  deletePostContentImages: Record<string, unknown>;
}>;
