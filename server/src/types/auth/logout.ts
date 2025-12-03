import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type Logout = ResolverFunc<MutationResolvers["logout"]>;
export type LogoutData = TestData<{ logout: Record<string, unknown> }>;
