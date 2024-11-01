import * as React from "react";

import { InMemoryCache, ApolloProvider } from "@apollo/client";

import { AuthContext } from ".";
import apolloClient from "./helpers/apolloClient";
import { BaseResponse, UserData } from "@cache/possibleTypes";
import * as typePolicies from "@cache/typePolicies";

interface AuthProviderProps {
  appClient?: ReturnType<typeof apolloClient>;
  children: React.ReactNode;
}

const AuthProvider = ({ children, appClient }: AuthProviderProps) => {
  const [jwt, setJwt] = React.useState("");

  const cache = React.useMemo(() => {
    return new InMemoryCache({
      possibleTypes: { BaseResponse, UserData },
      typePolicies,
    });
  }, []);

  const client = React.useMemo(() => {
    if (appClient) return appClient;

    return apolloClient(jwt, cache);
  }, [appClient, cache, jwt]);

  return (
    <AuthContext.Provider
      value={{ handleAuthHeader: token => setJwt(token), jwt }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
