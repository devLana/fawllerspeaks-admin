/* eslint-disable react-hooks/exhaustive-deps */

import * as React from "react";
import { useRouter } from "next/router";

import { ApolloError, useApolloClient } from "@apollo/client";
import { InvalidTokenError } from "jwt-decode";

import { useAuthHeaderHandler } from "@context/ApolloContext";
import { VERIFY_SESSION } from "../operations/VERIFY_SESSION";
import { SESSION_ID } from "@utils/constants";

type StringNullState = React.Dispatch<React.SetStateAction<string | null>>;

const msg =
  "An unexpected error has occurred while trying to verify your current session";

const useVerifySession = (
  handleRefreshToken: (accessToken: string) => void,
  setUserId: StringNullState
) => {
  const [clientHasRendered, setClientHasRendered] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const { pathname, replace, events } = useRouter();

  const client = useApolloClient();

  const { handleAuthHeader } = useAuthHeaderHandler();

  React.useEffect(() => {
    const handleRouteChanged = () => {
      setClientHasRendered(true);
    };

    events.on("routeChangeComplete", handleRouteChanged);

    return () => {
      events.off("routeChangeComplete", handleRouteChanged);
    };
  }, []);

  React.useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_ID);

    if (sessionId) {
      client
        .mutate({ mutation: VERIFY_SESSION, variables: { sessionId } })
        .then(({ data }) => {
          switch (data?.verifySession.__typename) {
            case "UnknownError":
              setErrorMessage(data.verifySession.message);
              setClientHasRendered(true);
              break;

            case "SessionIdValidationError":
            case "ForbiddenError":
              setErrorMessage(
                "Current logged in session could not be verified"
              );
              setClientHasRendered(true);
              break;

            case "NotAllowedError":
              localStorage.removeItem(SESSION_ID);
              void client.clearStore();

              if (
                pathname !== "/login" &&
                pathname !== "/forgot-password" &&
                pathname !== "/reset-password" &&
                pathname !== "/404"
              ) {
                void replace("/login");
              } else {
                setClientHasRendered(true);
              }
              break;

            case "VerifiedSession": {
              const { __typename = "User", ...user } = data.verifySession.user;

              if (user.isRegistered) {
                if (
                  pathname === "/login" ||
                  pathname === "/forgot-password" ||
                  pathname === "/reset-password" ||
                  pathname === "/register"
                ) {
                  void replace("/");
                } else {
                  setClientHasRendered(true);
                }
              } else if (pathname !== "/register") {
                void replace("/register");
              } else {
                setClientHasRendered(true);
              }

              handleAuthHeader(data.verifySession.accessToken);
              handleRefreshToken(data.verifySession.accessToken);
              setUserId(`${__typename}:${user.id}`);

              break;
            }

            default:
              throw new Error();
          }
        })
        .catch((err: Error) => {
          if (err instanceof InvalidTokenError) {
            setClientHasRendered(true);
            setErrorMessage(msg);
          } else if (err instanceof ApolloError) {
            const message =
              err.graphQLErrors.length > 0
                ? err.graphQLErrors[0].message
                : "Server is currently unreachable. Please try again later";

            setClientHasRendered(true);
            setErrorMessage(message);
          } else {
            setClientHasRendered(true);
            setErrorMessage(msg);
          }
        });
    } else {
      void client.clearStore();

      if (
        pathname !== "/login" &&
        pathname !== "/forgot-password" &&
        pathname !== "/reset-password" &&
        pathname !== "/404"
      ) {
        void replace("/login");
      } else {
        setClientHasRendered(true);
      }
    }
  }, []);

  return { clientHasRendered, errorMessage };
};

export default useVerifySession;
