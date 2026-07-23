import type { MutationResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";

export type ChangePassword = ResolverFunc<MutationResolvers["changePassword"]>;

export interface User {
  uId: number;
  email: string;
  is_registered: boolean;
  password: string;
  sId: number;
}

export type ChangePasswordData = TestData<{
  changePassword: Record<string, unknown>;
}>;
