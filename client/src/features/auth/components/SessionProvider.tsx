import * as React from "react";
import { useRouter } from "next/router";

import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

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

  return (
    <SessionContext.Provider
      value={{
        userId,
        handleUserId: (id: string) => setUserId(id),
        handleRefreshToken,
        handleClearRefreshTokenTimer,
      }}
    >
      {layout(page, clientHasRendered, errorMessage)}
      <Snackbar
        open={isOpen}
        message="Your access token could not be refreshed"
        action={
          <Tooltip title="Reload page">
            <IconButton size="small" color="inherit" onClick={() => reload()}>
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        }
        sx={{
          "&>.MuiSnackbarContent-root": {
            columnGap: 2,
            justifyContent: "center",
            "&>.MuiSnackbarContent-action": { m: 0, p: 0 },
          },
        }}
        ContentProps={{ sx: { textAlign: "center" } }}
      />
    </SessionContext.Provider>
  );
};

export default SessionProvider;
