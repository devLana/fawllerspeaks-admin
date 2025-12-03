import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type EditPostTag = ResolverFunc<MutationResolvers["editPostTag"]>;
export type EditTag = TestData<{ editPostTag: Record<string, unknown> }>;
