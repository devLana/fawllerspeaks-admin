import * as React from "react";

interface Auth {
  jwt: string;
  handleAuthHeader: (jwt: string) => void;
}

export const AuthContext = React.createContext<Auth | null>(null);

export const useAuth = () => {
  const value = React.useContext(AuthContext);

  if (!value) {
    throw new ReferenceError("Auth context provider not available");
  }

  return value;
};
