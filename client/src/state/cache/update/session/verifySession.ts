import { CACHE_USER } from "@queries/session/cacheUser";
import type { MutateOption } from "@appTypes";
import type { VerifySessionMutation } from "@appTypes/graphql";

type Update = MutateOption<VerifySessionMutation, object, "update">;

export const verifySessionUpdate: Update = (cache, { data }) => {
  if (data?.verifySession.__typename !== "SessionData") return;
  const { user } = data.verifySession;

  cache.writeQuery({ query: CACHE_USER, data: { me: user } });
};
