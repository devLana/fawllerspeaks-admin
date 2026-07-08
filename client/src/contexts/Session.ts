import { createContext } from "react";

interface Session {
  handleRefreshToken: (accessToken: string) => void;
  handleClearRefreshTokenTimer: () => void;
}

export const SessionContext = createContext<Session | null>(null);
