import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type Delete = ResolverFunc<MutationResolvers["deletePostContentImages"]>;
export type Result = () => Promise<{ error: string | null }>;

export type DeleteData = TestData<{
  deletePostContentImages: Record<string, unknown>;
}>;
