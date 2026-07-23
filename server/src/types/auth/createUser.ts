import type { MutationResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";

export type CreateUser = ResolverFunc<MutationResolvers["createUser"]>;
export type CreateUserData = TestData<{ createUser: Record<string, unknown> }>;
