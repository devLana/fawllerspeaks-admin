/* eslint-disable react-hooks/exhaustive-deps */

import * as React from "react";
import { useRouter } from "next/router";

import { SessionContext } from "@context/SessionContext";
import useRefreshToken from "../hooks/useRefreshToken";
import useVerifySession from "../hooks/useVerifySession";
import type { PageLayout } from "@types";

interface SessionProvideProps {
  layout: PageLayout;
  page: React.ReactElement;
}

const SessionProvider = ({ layout, page }: SessionProvideProps) => {
  const [clientHasRendered, setClientHasRendered] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { events } = useRouter();

  React.useEffect(() => {
    const handleRouteChanged = () => {
      setClientHasRendered(true);
    };

    events.on("routeChangeComplete", handleRouteChanged);

    return () => {
      events.off("routeChangeComplete", handleRouteChanged);
    };
  }, []);

  const { handleRefreshToken, handleClearRefreshTokenTimer } =
    useRefreshToken(setErrorMessage);

  useVerifySession(handleRefreshToken, {
    setErrorMessage,
    setUserId,
    setClientHasRendered,
  });

  const handleUserId = (id: string) => setUserId(id);

  const value = {
    userId,
    handleUserId,
    handleRefreshToken,
    handleClearRefreshTokenTimer,
  };

  return (
    <SessionContext.Provider value={value}>
      {layout(page, clientHasRendered, errorMessage)}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
