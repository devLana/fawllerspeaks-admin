import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = (jwt?: string, cache = new InMemoryCache()) => {
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL,
    cache,
    credentials: "include",
    ssrMode: false,
    connectToDevTools: typeof window !== "undefined",
    ...(jwt && { headers: { authorization: `Bearer ${jwt}` } }),
  });
};

export default apolloClient;
