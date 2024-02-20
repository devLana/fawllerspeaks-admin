import * as React from "react";

interface Session {
  userId: string | null;
  handleUserId: (userId: string) => void;
  handleRefreshToken: (accessToken: string) => void;
  handleClearRefreshTokenTimer: () => void;
}

export const SessionContext = React.createContext<Session | null>(null);

export const useSession = () => {
  const value = React.useContext(SessionContext);

  if (!value) {
    throw new ReferenceError("Session context provider not available");
  }

  return value;
};
