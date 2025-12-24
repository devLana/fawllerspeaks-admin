import { type MutationResolvers } from "@resolverTypes";
import type { ResolverFunc } from "@types";
import type { TestData } from "types/tests";

export type Login = ResolverFunc<MutationResolvers["login"]>;

export interface DBUser {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  image: string | null;
  email: string;
  password: string;
  is_registered: boolean;
  date_created: string;
}

export type LoginData = TestData<{ login: Record<string, unknown> }>;
