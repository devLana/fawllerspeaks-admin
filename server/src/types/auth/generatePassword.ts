import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type GeneratePassword = ResolverFunc<
  MutationResolvers["generatePassword"]
>;

export type GeneratePasswordData = TestData<{
  generatePassword: Record<string, unknown>;
}>;
