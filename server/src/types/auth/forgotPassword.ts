import type { MutationResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";

export type ForgotPassword = ResolverFunc<MutationResolvers["forgotPassword"]>;

export interface UserData {
  id: number;
  is_registered: boolean;
  email: string;
}

export type ForgotPasswordData = TestData<{
  forgotPassword: Record<string, unknown>;
}>;
