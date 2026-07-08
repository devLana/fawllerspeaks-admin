/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client/react";

import { useAuth } from "@hooks/common/useAuth";
import { useToast } from "@hooks/common/useToast";
import { REFRESH_TOKEN } from "@mutations/session/refreshToken";

export const useRefreshToken = (action: React.ReactElement) => {
  const [timer, setTimer] = useState(0);
  const refreshTokenTimerId = useRef<number>(undefined);
  const { replace, pathname } = useRouter();

  const client = useApolloClient();

  const { handleAuthHeader } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (timer) {
      refreshTokenTimerId.current = window.setTimeout(() => {
        void refreshToken();
      }, timer);
    }

    return () => {
      window.clearTimeout(refreshTokenTimerId.current);
    };
  }, [timer]);

  async function refreshToken() {
    try {
      const { data } = await client.mutate({ mutation: REFRESH_TOKEN });

      switch (data?.refreshToken.__typename) {
        case "UnauthorizedError": {
          const query = { status: "unauthorized", redirectTo: pathname };
          void client.clearStore();
          void replace({ pathname: "/login", query });
          break;
        }

        case "ForbiddenError": {
          const query = { status: "invalid", redirectTo: pathname };
          void client.clearStore();
          void replace({ pathname: "/login", query });
          break;
        }

        case "RefreshData":
          handleRefreshToken(data.refreshToken.accessToken);
          handleAuthHeader(data.refreshToken.accessToken);
          break;

        default:
          throw new Error("Unsupported object type received");
      }
    } catch {
      toast({
        content: "Your access token could not be refreshed",
        key: "Your access token could not be refreshed",
        action,
        autoHideDuration: null,
        severity: "error",
      });
    }
  }

  function handleRefreshToken(accessToken: string) {
    const [, payload] = accessToken.split(".");
    const payloadJson = window.atob(payload);
    const decoded = JSON.parse(payloadJson) as unknown;

    if (
      typeof decoded !== "object" ||
      Array.isArray(decoded) ||
      decoded === null
    ) {
      throw new SyntaxError("malformed access token received");
    } else if (!("exp" in decoded)) {
      const msg = "'exp' field not provided in the access token payload";
      throw new ReferenceError(msg);
    } else if (typeof decoded.exp !== "number") {
      throw new TypeError("'exp' field in the access token is not a number");
    }

    const modifier = 20 * 1000;
    const validityPeriod = decoded.exp * 1000 - Date.now();
    const requestTime = validityPeriod - modifier;

    setTimer(requestTime);
  }

  const handleClearRefreshTokenTimer = () => {
    window.clearTimeout(refreshTokenTimerId.current);
  };

  return { handleRefreshToken, handleClearRefreshTokenTimer };
};
