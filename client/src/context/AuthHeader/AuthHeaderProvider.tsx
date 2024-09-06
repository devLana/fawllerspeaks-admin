import * as React from "react";

import { InMemoryCache, ApolloProvider } from "@apollo/client";

import { AuthHeaderContext } from ".";
import { BaseResponse, UserData } from "./cachePossibleTypes";
import apolloClient from "./apolloClient";

const AuthHeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [jwt, setJwt] = React.useState("");

  const cache = React.useMemo(() => {
    return new InMemoryCache({ possibleTypes: { BaseResponse, UserData } });
  }, []);

  const client = React.useMemo(() => {
    return apolloClient(jwt, cache);
  }, [cache, jwt]);

  return (
    <AuthHeaderContext.Provider
      value={{ handleAuthHeader: token => setJwt(token), jwt }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AuthHeaderContext.Provider>
  );
};

export default AuthHeaderProvider;
