import * as React from "react";

interface SessionContextValues {
  userId: string | null;
  handleUserId: (userId: string) => void;
  handleRefreshToken: (accessToken: string) => void;
  handleClearRefreshTokenTimer: () => void;
}

type SessionContextValue = SessionContextValues | null;

export const SessionContext = React.createContext<SessionContextValue>(null);

export const useSession = () => {
  const value = React.useContext(SessionContext);

  if (!value) {
    throw new ReferenceError("SessionContext provider not available");
  }

  return value;
};
