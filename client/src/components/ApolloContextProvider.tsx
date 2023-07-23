import * as React from "react";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ApolloContext } from "@context/ApolloContext";

const cache = new InMemoryCache();

const ApolloContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [jwt, setJwt] = React.useState("");

  const client = React.useMemo(() => {
    if (jwt) {
      return new ApolloClient({
        uri: "http://localhost:7692/",
        cache,
        credentials: "include",
        ssrMode: typeof window === "undefined",
        headers: { authorization: `Bearer ${jwt}` },
      });
    }

    return new ApolloClient({
      uri: "http://localhost:7692/",
      cache,
      credentials: "include",
      ssrMode: typeof window === "undefined",
    });
  }, [jwt]);

  const handleAuthHeader = (token: string) => setJwt(token);

  return (
    <ApolloContext.Provider value={handleAuthHeader}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ApolloContext.Provider>
  );
};

export default ApolloContextProvider;
