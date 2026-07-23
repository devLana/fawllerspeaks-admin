import type { MutationResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";

import type { TestData } from "@appTypes/tests";

export type Reset = ResolverFunc<MutationResolvers["resetPassword"]>;

export type ResetPassword = TestData<{
  resetPassword: Record<string, unknown>;
}>;

export interface User {
  userId: number;
  is_registered: boolean;
  email: string;
  used: boolean;
  expire_date: string;
}
