import { type QueryResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type VerifyToken = ResolverFunc<QueryResolvers["verifyResetToken"]>;

export interface VerifyData {
  email: string;
  is_registered: boolean;
  used: boolean;
  expire_date: string;
}

export type VerifyResetToken = TestData<{
  verifyResetToken: Record<string, unknown>;
}>;
