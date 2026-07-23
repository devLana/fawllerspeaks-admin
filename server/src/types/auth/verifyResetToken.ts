import type { QueryResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";

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
