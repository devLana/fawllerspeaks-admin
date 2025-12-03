import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type DeletePostTags = ResolverFunc<MutationResolvers["deletePostTags"]>;
export type DeleteTags = TestData<{ deletePostTags: Record<string, unknown> }>;
