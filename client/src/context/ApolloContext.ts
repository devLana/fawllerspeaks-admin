import * as React from "react";

interface ApolloContextValues {
  jwt: string;
  handleAuthHeader: (jwt: string) => void;
}

type ApolloContextValue = ApolloContextValues | null;

export const ApolloContext = React.createContext<ApolloContextValue>(null);

export const useAuthHeaderHandler = () => {
  const value = React.useContext(ApolloContext);

  if (!value) throw new ReferenceError("ApolloContext provider not available");

  return value;
};
