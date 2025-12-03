import type { jest } from "@jest/globals";
import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type Refresh = ResolverFunc<MutationResolvers["refreshToken"]>;

export interface DBResponse {
  refreshToken: string;
  userId: number;
  userEmail: string;
  userUUID: string;
}

export type RefreshData = TestData<{ refreshToken: Record<string, unknown> }>;
export type RefreshMockFn = jest.MockedFunction<() => unknown>;
