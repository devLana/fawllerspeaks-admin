import * as React from "react";
import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client";

import { useSession } from "@context/Session";
import { SESSION_ID } from "@utils/constants";
import type { OnCompleted, Status } from "@types";
import type { LogoutData } from "types/layouts/logout";

const useLogout = (onCloseModal: () => void) => {
  const [status, setStatus] = React.useState<Status>("idle");
  const { replace } = useRouter();
  const client = useApolloClient();
  const { handleClearRefreshTokenTimer } = useSession();

  const onCompleted: OnCompleted<LogoutData> = logoutData => {
    switch (logoutData.logout.__typename) {
      case "NotAllowedError":
      case "UnknownError":
      case "SessionIdValidationError":
      default:
        onCloseModal();
        setStatus("error");
        break;

      case "AuthenticationError": {
        const query = { status: "unauthenticated" };

        localStorage.removeItem(SESSION_ID);
        handleClearRefreshTokenTimer();
        void client.clearStore();
        void replace({ pathname: "/login", query });
        break;
      }

      case "Response":
        localStorage.removeItem(SESSION_ID);
        handleClearRefreshTokenTimer();
        void client.clearStore();
        void replace("/login");
    }
  };

  return { status, setStatus, onCompleted };
};

export default useLogout;
