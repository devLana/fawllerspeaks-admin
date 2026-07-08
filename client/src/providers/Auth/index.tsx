import { useMemo, useState } from "react";

import { InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

import { AuthContext } from "@contexts/Auth";
import apolloClient from "./helpers/apolloClient";
import { BaseResponse } from "@cache/possibleTypes";
import * as typePolicies from "@cache/typePolicies";

interface AuthProviderProps {
  appClient?: ReturnType<typeof apolloClient>;
  children: React.ReactNode;
}

const AuthProvider = ({ children, appClient }: AuthProviderProps) => {
  const [jwt, setJwt] = useState("");

  const cache = useMemo(() => {
    return new InMemoryCache({ possibleTypes: { BaseResponse }, typePolicies });
  }, []);

  const client = useMemo(() => {
    if (appClient) return appClient;
    return apolloClient(jwt, cache);
  }, [appClient, cache, jwt]);

  const handleAuthHeader = (token: string) => setJwt(token);

  return (
    <AuthContext.Provider value={{ handleAuthHeader, jwt }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
