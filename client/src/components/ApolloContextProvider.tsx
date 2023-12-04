import * as React from "react";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import { ApolloContext } from "@context/ApolloContext";
import { BaseResponse, UserData } from "@utils/cachePossibleTypes";

const ApolloContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [jwt, setJwt] = React.useState("");

  const cache = React.useMemo(() => {
    return new InMemoryCache({ possibleTypes: { BaseResponse, UserData } });
  }, []);

  const client = React.useMemo(() => {
    return new ApolloClient({
      uri: "http://localhost:7692/",
      cache,
      credentials: "include",
      ssrMode: typeof window === "undefined",
      ...(jwt ? { headers: { authorization: `Bearer ${jwt}` } } : {}),
    });
  }, [jwt, cache]);

  return (
    <ApolloContext.Provider
      value={{ handleAuthHeader: token => setJwt(token), jwt }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ApolloContext.Provider>
  );
};

export default ApolloContextProvider;
