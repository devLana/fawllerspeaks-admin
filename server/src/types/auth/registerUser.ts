import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type RegisterUser = ResolverFunc<MutationResolvers["registerUser"]>;

export interface Select {
  email: string;
  image: string | null;
  isRegistered: boolean;
  dateCreated: string;
}

export type RegisterUserData = TestData<{
  registerUser: Record<string, unknown>;
}>;
