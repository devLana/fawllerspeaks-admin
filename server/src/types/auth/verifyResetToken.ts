import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type VerifyToken = ResolverFunc<MutationResolvers["verifyResetToken"]>;

export interface Verification {
  email: string;
  isRegistered: boolean;
  resetId: number;
}

export type VerifyResetToken = TestData<{
  verifyResetToken: Record<string, unknown>;
}>;
