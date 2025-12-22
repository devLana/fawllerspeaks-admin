import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

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
