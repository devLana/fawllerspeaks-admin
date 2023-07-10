import * as React from "react";

type AuthHeaderHandler = (jwt: string) => void;
type ApolloContextValue = AuthHeaderHandler | null;

export const ApolloContext = React.createContext<ApolloContextValue>(null);

export const useAuthHeaderHandler = () => {
  const value = React.useContext(ApolloContext);

  if (!value) throw new ReferenceError("ApolloContext provider not available");

  return value;
};
