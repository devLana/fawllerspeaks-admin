import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type VerifySession = ResolverFunc<MutationResolvers["verifySession"]>;
export type Verify = TestData<{ verifySession: Record<string, unknown> }>;

export interface DBResponse {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  image: string | null;
  is_registered: boolean;
  date_created: string;
  sid: number;
  ip_address: string | null;
  user_agent: string | null;
  expire_date: string;
  revoked_at: string | null;
}
