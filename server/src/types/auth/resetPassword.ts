import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";

import type { TestData } from "types/tests";

export type Reset = ResolverFunc<MutationResolvers["resetPassword"]>;

export type ResetPassword = TestData<{
  resetPassword: Record<string, unknown>;
}>;

export interface User {
  userId: number;
  isRegistered: boolean;
  email: string;
  resetId: number;
}
