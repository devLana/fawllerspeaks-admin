import * as React from "react";

interface AuthHeader {
  jwt: string;
  handleAuthHeader: (jwt: string) => void;
}

export const AuthHeaderContext = React.createContext<AuthHeader | null>(null);

export const useAuthHeader = () => {
  const value = React.useContext(AuthHeaderContext);

  if (!value) {
    throw new ReferenceError("AuthHeader context provider not available");
  }

  return value;
};
