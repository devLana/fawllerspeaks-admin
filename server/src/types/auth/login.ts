import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type Login = ResolverFunc<MutationResolvers["login"]>;

export interface DBUser {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  userEmail: string;
  userPassword: string;
  isRegistered: boolean;
  dateCreated: string;
}

export type LoginData = TestData<{ login: Record<string, unknown> }>;
