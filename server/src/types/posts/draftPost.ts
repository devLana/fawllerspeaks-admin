import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { PostFieldResolver } from ".";
import type { TestData } from "types/tests";

export type DraftPost = PostFieldResolver<
  ResolverFunc<MutationResolvers["draftPost"]>
>;

export type DraftData = TestData<{ draftPost: Record<string, unknown> }>;
