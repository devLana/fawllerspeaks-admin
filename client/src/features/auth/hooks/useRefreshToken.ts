/* eslint-disable react-hooks/exhaustive-deps */

import * as React from "react";
import { useRouter } from "next/router";

import { ApolloError, gql, useApolloClient } from "@apollo/client";
import jwt_decode, { type JwtPayload } from "jwt-decode";

import { REFRESH_TOKEN } from "../operations/REFRESH_TOKEN";
import { SESSION_ID } from "@utils/constants";
import { useAuthHeaderHandler } from "@context/ApolloContext";

type SorN = string | null;
type Claims = "exp" | "iat" | "sub";
type Decoded = Required<Pick<JwtPayload, Claims>>;
type SetErrorMessage = React.Dispatch<React.SetStateAction<SorN>>;

const useRefreshToken = (setErrorMessage: SetErrorMessage, userId: SorN) => {
  const [timer, setTimer] = React.useState(0);
  const refreshTokenTimerId = React.useRef<number>();

  const router = useRouter();
  const client = useApolloClient();

  const handleAuthHeader = useAuthHeaderHandler();

  const refreshToken = async (sessionId: string) => {
    try {
      const { data } = await client.mutate({
        mutation: REFRESH_TOKEN,
        variables: { sessionId },
      });

      switch (data?.refreshToken.__typename) {
        case "SessionIdValidationError":
        case "UnknownError":
        case "UserSessionError":
          setErrorMessage("Your access token could not be refreshed");
          break;

        case "AuthenticationError":
          localStorage.removeItem(SESSION_ID);
          void client.clearStore();
          void router.replace("/login?status=unauthenticated");
          break;

        case "NotAllowedError":
          localStorage.removeItem(SESSION_ID);
          void client.clearStore();
          void router.replace("/login?status=unauthorized");
          break;

        case "AccessToken": {
          const { accessToken } = data.refreshToken;

          handleAuthHeader(accessToken);
          handleRefreshToken(accessToken);
          client.writeFragment({
            id: userId ?? "",
            fragment: gql`
              fragment UpdateAuthUser on User {
                accessToken
              }
            `,
            data: { accessToken },
          });

          break;
        }

        default:
          throw new Error(
            "An unexpected error has occurred while trying to refresh your access token"
          );
      }
    } catch (err) {
      if (err instanceof ApolloError && err.networkError) {
        setErrorMessage(
          "Server is currently unreachable. Please try again later"
        );
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    }
  };

  React.useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_ID);

    if (sessionId && timer) {
      const delay = timer < 0 ? 0 : timer;

      refreshTokenTimerId.current = window.setTimeout(() => {
        void refreshToken(sessionId);
      }, delay);
    }

    return () => {
      window.clearTimeout(refreshTokenTimerId.current);
    };
  }, [timer]);

  function handleRefreshToken(accessToken: string) {
    const decoded = jwt_decode<Decoded>(accessToken);
    const modifier = 10 * 1000;
    const validityPeriod = decoded.exp * 1000 - Date.now();
    const requestTime = validityPeriod - modifier;

    setTimer(requestTime);
  }

  const handleClearRefreshTokenTimer = () => {
    window.clearTimeout(refreshTokenTimerId.current);
  };

  return { handleRefreshToken, handleClearRefreshTokenTimer };
};

export default useRefreshToken;
