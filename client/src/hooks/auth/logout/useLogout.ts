import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

import { useSession } from "@hooks/session/useSession";
import { useToast } from "@hooks/common/useToast";
import type { MutateOption } from "@appTypes";
import type { LogoutMutation } from "@appTypes/graphql";

type OnCompleted = MutateOption<LogoutMutation, object, "onCompleted">;
type OnError = MutateOption<LogoutMutation, object, "onError">;

export const useLogout = () => {
  const { push } = useRouter();
  const client = useApolloClient();

  const { handleClearRefreshTokenTimer } = useSession();
  const showToast = useToast();

  const onError: (cb: () => void) => OnError = cb => err => {
    let msg = `We are unable to log you out at the moment. Please try again later`;

    if (CombinedGraphQLErrors.is(err)) {
      msg = err.errors[0].message;
    } else if (err instanceof TypeError && err.message === "Failed to fetch") {
      msg = "The server is currently unreachable. Please try again later";
    }

    cb();
    showToast({ key: msg, content: msg, severity: "error" });
  };

  const onCompleted: OnCompleted = () => {
    handleClearRefreshTokenTimer();
    void client.clearStore();
    void push("/login");
  };

  return { onCompleted, onError };
};
