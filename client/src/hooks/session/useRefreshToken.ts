/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client";

import { useAuth } from "@context/Auth";
import { REFRESH_TOKEN } from "@mutations/session/REFRESH_TOKEN";
import { SESSION_ID } from "@utils/constants";

const useRefreshToken = () => {
  const [timer, setTimer] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const refreshTokenTimerId = React.useRef<number>();
  const { replace, pathname } = useRouter();

  const client = useApolloClient();

  const { handleAuthHeader } = useAuth();

  const refreshToken = async (sessionId: string) => {
    try {
      const { data } = await client.mutate({
        mutation: REFRESH_TOKEN,
        variables: { sessionId },
      });

      switch (data?.refreshToken.__typename) {
        case "UserSessionError":
        case "SessionIdValidationError":
        case "UnknownError":
        case "ForbiddenError":
        default:
          setIsOpen(true);
          break;

        case "AuthCookieError": {
          const query = { status: "expired", redirectTo: pathname };

          localStorage.removeItem(SESSION_ID);
          void client.clearStore();
          void replace({ pathname: "/login", query });
          break;
        }

        case "NotAllowedError": {
          const query = { status: "unauthorized" };

          localStorage.removeItem(SESSION_ID);
          void client.clearStore();
          void replace({ pathname: "/login", query });
          break;
        }

        case "AccessToken":
          handleRefreshToken(data.refreshToken.accessToken);
          handleAuthHeader(data.refreshToken.accessToken);
          break;
      }
    } catch {
      setIsOpen(true);
    }
  };

  React.useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_ID);

    if (sessionId && timer) {
      refreshTokenTimerId.current = window.setTimeout(() => {
        void refreshToken(sessionId);
      }, timer);
    }

    return () => {
      window.clearTimeout(refreshTokenTimerId.current);
    };
  }, [timer]);

  function handleRefreshToken(accessToken: string) {
    const [, payload] = accessToken.split(".");
    const payloadJson = window.atob(payload);
    const decoded = JSON.parse(payloadJson) as { exp: number };
    const modifier = 15 * 1000;
    const validityPeriod = decoded.exp * 1000 - Date.now();
    const requestTime = validityPeriod - modifier;

    setTimer(requestTime);
  }

  const handleClearRefreshTokenTimer = () => {
    window.clearTimeout(refreshTokenTimerId.current);
  };

  return { handleRefreshToken, handleClearRefreshTokenTimer, isOpen };
};

export default useRefreshToken;
