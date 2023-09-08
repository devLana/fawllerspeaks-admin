/* eslint-disable react-hooks/exhaustive-deps */

import * as React from "react";
import { useRouter } from "next/router";

import { ApolloError, useApolloClient } from "@apollo/client";
import { InvalidTokenError } from "jwt-decode";

import { useAuthHeaderHandler } from "@context/ApolloContext";
import { VERIFY_SESSION } from "../operations/VERIFY_SESSION";
import { SESSION_ID } from "@utils/constants";

type StringNullState = React.Dispatch<React.SetStateAction<string | null>>;
type SetClientHasRendered = React.Dispatch<React.SetStateAction<boolean>>;

interface StateSetters {
  setErrorMessage: StringNullState;
  setUserId: StringNullState;
  setClientHasRendered: SetClientHasRendered;
}

const msg =
  "An unexpected error has occurred while trying to verify your current session";

const useVerifySession = (
  handleRefreshToken: (accessToken: string) => void,
  { setErrorMessage, setUserId, setClientHasRendered }: StateSetters
) => {
  const client = useApolloClient();
  const { pathname, replace } = useRouter();

  const { handleAuthHeader } = useAuthHeaderHandler();

  React.useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_ID);
    let isMounted = true;

    if (sessionId) {
      client
        .query({ query: VERIFY_SESSION, variables: { sessionId } })
        .then(({ data }) => {
          switch (data.verifySession.__typename) {
            case "UnknownError":
              if (isMounted) {
                setErrorMessage(data.verifySession.message);
                setClientHasRendered(true);
              }
              break;

            case "SessionIdValidationError":
            case "UserSessionError":
              if (isMounted) {
                setErrorMessage(
                  "Current logged in session could not be verified"
                );
                setClientHasRendered(true);
              }
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
                if (isMounted) void replace("/login");
              } else if (isMounted) {
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
                  if (isMounted) void replace("/");
                } else if (isMounted) {
                  setClientHasRendered(true);
                }
              } else if (pathname !== "/register") {
                if (isMounted) void replace("/register");
              } else if (isMounted) {
                setClientHasRendered(true);
              }

              handleAuthHeader(data.verifySession.accessToken);
              handleRefreshToken(data.verifySession.accessToken);
              setUserId(`${__typename}:${user.id}`);

              break;
            }

            default:
              throw new Error(msg);
          }
        })
        .catch((err: Error) => {
          if (err instanceof InvalidTokenError && isMounted) {
            setClientHasRendered(true);
            setErrorMessage(msg);
          } else if (err instanceof ApolloError && err.networkError) {
            if (isMounted) {
              setClientHasRendered(true);
              setErrorMessage(
                "Server is currently unreachable. Please try again later"
              );
            }
          } else if (isMounted) {
            setErrorMessage(err.message);
            setClientHasRendered(true);
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

    return () => {
      isMounted = false;
    };
  }, []);
};

export default useVerifySession;
