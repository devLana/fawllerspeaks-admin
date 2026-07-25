import { CACHE_USER } from "@queries/session/cacheUser";
import type { MutateOption } from "@appTypes";
import type { LoginMutationVariables } from "@appTypes/graphql";
import type { LoginData } from "@appTypes/auth/login";

type Update = MutateOption<LoginData, LoginMutationVariables, "update">;

export const loginUpdate: Update = (cache, { data }) => {
  if (data?.login.__typename !== "SessionData") return;
  const { user } = data.login;

  cache.writeQuery({ query: CACHE_USER, data: { me: user } });
};
