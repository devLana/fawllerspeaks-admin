import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type ChangePassword = ResolverFunc<MutationResolvers["changePassword"]>;

export interface User {
  email: string;
  is_registered: boolean;
  password: string;
}

export type ChangePasswordData = TestData<{
  changePassword: Record<string, unknown>;
}>;
