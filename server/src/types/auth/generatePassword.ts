import type { MutationResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";

export type GeneratePassword = ResolverFunc<
  MutationResolvers["generatePassword"]
>;

export type GeneratePasswordData = TestData<{
  generatePassword: Record<string, unknown>;
}>;
