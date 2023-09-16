/* eslint-disable react-hooks/exhaustive-deps */

import * as React from "react";
import { useRouter } from "next/router";

import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";

import useRefreshToken from "../hooks/useRefreshToken";
import useVerifySession from "../hooks/useVerifySession";
import { SessionContext } from "@context/SessionContext";
import type { PageLayout } from "@types";

interface SessionProvideProps {
  layout: PageLayout;
  page: React.ReactElement;
}

const SessionProvider = ({ layout, page }: SessionProvideProps) => {
  const [userId, setUserId] = React.useState<string | null>(null);
  const { reload } = useRouter();

  const { handleRefreshToken, handleClearRefreshTokenTimer, isOpen } =
    useRefreshToken();

  const { clientHasRendered, errorMessage } = useVerifySession(
    handleRefreshToken,
    setUserId
  );

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
      <Snackbar
        open={isOpen}
        message="Your access token could not be refreshed"
        action={
          <Button size="small" variant="contained" onClick={() => reload()}>
            Reload Page
          </Button>
        }
      />
    </SessionContext.Provider>
  );
};

export default SessionProvider;
