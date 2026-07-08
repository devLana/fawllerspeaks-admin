import { useRouter } from "next/router";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { SessionContext } from "@contexts/Session";
import { useRefreshToken } from "@hooks/session/useRefreshToken";
import { useVerifySession } from "@hooks/session/useVerifySession";
import type { PageLayoutFn } from "@appTypes";

interface SessionProvideProps {
  layout: PageLayoutFn;
  page: React.ReactElement;
}

const Action = () => {
  const { reload } = useRouter();

  return (
    <Tooltip title="Reload page">
      <IconButton size="small" color="inherit" onClick={() => reload()}>
        <RestartAltIcon />
      </IconButton>
    </Tooltip>
  );
};

const SessionProvider = ({ layout, page }: SessionProvideProps) => {
  const { handleRefreshToken, handleClearRefreshTokenTimer } = useRefreshToken(
    <Action />,
  );

  const { isVerifying, errorMessage } = useVerifySession(handleRefreshToken);

  return (
    <SessionContext.Provider
      value={{ handleRefreshToken, handleClearRefreshTokenTimer }}
    >
      {layout(page, isVerifying, errorMessage)}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
