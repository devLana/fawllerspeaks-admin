import type { jest } from "@jest/globals";
import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type Refresh = ResolverFunc<MutationResolvers["refreshToken"]>;

export interface DBResponse {
  sid: number;
  expire_date: string;
  ip_address: string | null;
  user_agent: string | null;
  revoked_at: string | null;
  email: string;
  user_id: string;
}

export type RefreshData = TestData<{ refreshToken: Record<string, unknown> }>;
export type MockFn = jest.MockedFunction<() => unknown>;
