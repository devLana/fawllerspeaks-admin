/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

import { useAuth } from "@hooks/common/useAuth";
import { VERIFY_SESSION } from "@mutations/session/verifySession";
import { verifySessionUpdate as update } from "@cache/update/session/verifySession";

export const useVerifySession = (
  handleRefreshToken: (token: string) => void,
) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { pathname, replace } = useRouter();

  const client = useApolloClient();
  const { handleAuthHeader, jwt } = useAuth();

  useEffect(() => {
    if (jwt) {
      handleRefreshToken(jwt);
      return;
    }

    client
      .mutate({ mutation: VERIFY_SESSION, update })
      .then(({ data }) => {
        switch (data?.verifySession.__typename) {
          case "UnauthorizedError":
          case "ForbiddenError":
            void replace("/login");
            void client.clearStore();
            break;

          case "SessionData": {
            const { user, accessToken } = data.verifySession;

            if (user.isRegistered && pathname === "/register") {
              void replace("/");
            } else if (!user.isRegistered && pathname !== "/register") {
              void replace("/register");
            }

            handleAuthHeader(accessToken);
            handleRefreshToken(accessToken);
            setIsVerifying(false);
            break;
          }

          default:
            throw new Error("Unsupported object type received");
        }
      })
      .catch((e: unknown) => {
        let msg = `An unexpected error has occurred while trying to verify your current session`; // Other unexpected errors

        if (CombinedGraphQLErrors.is(e)) {
          msg = e.errors[0].message;
        } else if (e instanceof TypeError && e.message === "Failed to fetch") {
          msg = "The server is currently unreachable. Please try again later"; // Network error
        }

        setErrorMessage(msg);
        setIsVerifying(false);
      });
  }, []);

  return { isVerifying, errorMessage };
};
