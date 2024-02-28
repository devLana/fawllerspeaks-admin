/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useRouter } from "next/router";

import { ApolloError, useApolloClient } from "@apollo/client";

import { useAuthHeader } from "@context/AuthHeader";
import { VERIFY_SESSION } from "../operations/VERIFY_SESSION";
import { SESSION_ID } from "@utils/constants";

type HandleRefreshToken = (accessToken: string) => void;

const useVerifySession = (handleRefreshToken: HandleRefreshToken) => {
  const [clientHasRendered, setClientHasRendered] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const { pathname, replace, events } = useRouter();

  const client = useApolloClient();

  React.useEffect(() => {
    const handleRouteChanged = () => {
      setClientHasRendered(true);
    };

    events.on("routeChangeComplete", handleRouteChanged);

    return () => {
      events.off("routeChangeComplete", handleRouteChanged);
    };
  }, []);

  const { handleAuthHeader } = useAuthHeader();

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

            case "AuthCookieError":
              void client.clearStore();

              if (pathname === "/login") {
                setClientHasRendered(true);
              } else {
                void replace("/login");
              }
              break;

            case "NotAllowedError":
              localStorage.removeItem(SESSION_ID);
              void client.clearStore();

              if (
                pathname !== "/login" &&
                pathname !== "/forgot-password" &&
                pathname !== "/reset-password" &&
                pathname !== "/404" &&
                pathname !== "/500"
              ) {
                void replace("/login");
              } else {
                setClientHasRendered(true);
              }
              break;

            case "VerifiedSession": {
              const { __typename = "User", ...user } = data.verifySession.user;

              handleRefreshToken(data.verifySession.accessToken);

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
              setUserId(`${__typename}:${user.id}`);
              break;
            }

            default:
              throw new Error();
          }
        })
        .catch(err => {
          if (err instanceof ApolloError) {
            const message =
              err.graphQLErrors[0]?.message ??
              "Server is currently unreachable. Please try again later";

            setClientHasRendered(true);
            setErrorMessage(message);
          } else {
            setClientHasRendered(true);
            setErrorMessage(
              "An unexpected error has occurred while trying to verify your current session"
            );
          }
        });
    } else {
      void client.clearStore();

      if (
        pathname === "/login" ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password" ||
        pathname === "/404" ||
        pathname === "/500"
      ) {
        setClientHasRendered(true);
      } else {
        void replace("/login");
      }
    }
  }, []);

  const handleUserId = (id: string) => setUserId(id);

  return { clientHasRendered, errorMessage, userId, handleUserId };
};

export default useVerifySession;
