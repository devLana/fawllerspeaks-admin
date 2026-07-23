import type { MutationResolvers } from "@appTypes/resolverTypes";
import type { ResolverFunc } from "@appTypes";
import type { TestData } from "@appTypes/tests";

export type RegisterUser = ResolverFunc<MutationResolvers["registerUser"]>;

export interface Select {
  email: string;
  image: string | null;
  is_registered: boolean;
  date_created: string;
}

export type RegisterUserData = TestData<{
  registerUser: Record<string, unknown>;
}>;
