import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type CreateUser = ResolverFunc<MutationResolvers["createUser"]>;
export type CreateUserData = TestData<{ createUser: Record<string, unknown> }>;
