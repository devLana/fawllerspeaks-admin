import type { MutationResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";

export type Logout = ResolverFunc<MutationResolvers["logout"]>;
export type LogoutData = TestData<{ logout: Record<string, unknown> }>;
