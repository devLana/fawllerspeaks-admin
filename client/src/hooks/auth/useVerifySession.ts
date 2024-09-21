/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useRouter } from "next/router";

import { ApolloError, useApolloClient } from "@apollo/client";

import { useAuthHeader } from "@context/AuthHeader";
import { VERIFY_SESSION } from "@mutations/auth/VERIFY_SESSION";
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
    const regex = /^\/(?:login|forgot-password|reset-password|404|500)/;

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
              if (pathname === "/login") {
                setClientHasRendered(true);
              } else {
                void replace("/login");
              }

              void client.clearStore();
              localStorage.removeItem(SESSION_ID);
              break;

            case "NotAllowedError": {
              if (!regex.test(pathname)) {
                void replace("/login");
              } else {
                setClientHasRendered(true);
              }

              localStorage.removeItem(SESSION_ID);
              void client.clearStore();
              break;
            }

            case "VerifiedSession": {
              const { __typename = "User", ...user } = data.verifySession.user;
              const re = /^\/(?:login|forgot-password|reset-password|register)/;

              handleRefreshToken(data.verifySession.accessToken);

              if (user.isRegistered) {
                if (re.test(pathname)) {
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
              err.graphQLErrors?.[0]?.message ??
              "Server is currently unreachable. Please try again later";

            setErrorMessage(message);
          } else {
            setErrorMessage(
              "An unexpected error has occurred while trying to verify your current session"
            );
          }

          setClientHasRendered(true);
        });
    } else {
      void client.clearStore();

      if (regex.test(pathname)) {
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
