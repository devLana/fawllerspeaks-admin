import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type ForgotPassword = ResolverFunc<MutationResolvers["forgotPassword"]>;

export interface UserData {
  id: number;
  is_registered: boolean;
  email: string;
}

export type ForgotPasswordData = TestData<{
  forgotPassword: Record<string, unknown>;
}>;
