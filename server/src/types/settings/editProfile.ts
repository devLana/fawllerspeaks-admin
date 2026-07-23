import type { MutationResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";

export type Edit = ResolverFunc<MutationResolvers["editProfile"]>;

export interface SelectInfo {
  is_registered: boolean;
  image: string | null;
}

export interface UserInfo {
  date_created: string;
  email: string;
  image: string | null;
}

export type EditProfile = TestData<{ editProfile: Record<string, unknown> }>;
