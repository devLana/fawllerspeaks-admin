import type { MutationResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";

export type EditPostTag = ResolverFunc<MutationResolvers["editPostTag"]>;
export type EditTag = TestData<{ editPostTag: Record<string, unknown> }>;
