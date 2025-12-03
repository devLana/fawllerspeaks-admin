import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type VerifySession = ResolverFunc<MutationResolvers["verifySession"]>;
export type Verify = TestData<{ verifySession: Record<string, unknown> }>;

export interface DBResponse {
  userId: string;
  userUUID: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  isRegistered: boolean;
  dateCreated: string;
}
