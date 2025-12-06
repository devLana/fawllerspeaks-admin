import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";

import type { TestData } from "types/tests";

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
