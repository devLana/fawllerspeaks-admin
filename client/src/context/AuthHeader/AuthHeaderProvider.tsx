import * as React from "react";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import { AuthHeaderContext } from ".";
import { BaseResponse, UserData } from "@utils/cachePossibleTypes";

const AuthHeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [jwt, setJwt] = React.useState("");

  const cache = React.useMemo(() => {
    return new InMemoryCache({ possibleTypes: { BaseResponse, UserData } });
  }, []);

  const client = React.useMemo(() => {
    return new ApolloClient({
      uri: process.env.NEXT_PUBLIC_API_URL,
      cache,
      credentials: "include",
      ssrMode: typeof window === "undefined",
      connectToDevTools: true,
      ...(jwt ? { headers: { authorization: `Bearer ${jwt}` } } : {}),
    });
  }, [jwt, cache]);

  return (
    <AuthHeaderContext.Provider
      value={{ handleAuthHeader: token => setJwt(token), jwt }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AuthHeaderContext.Provider>
  );
};

export default AuthHeaderProvider;
