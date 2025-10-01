import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const apolloClient = (jwt?: string, cache = new InMemoryCache()) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL,
      credentials: "include",
      ...(jwt && { headers: { authorization: `Bearer ${jwt}` } }),
    }),
    cache,
    ssrMode: false,
    devtools: { name: "fawllerspeaks_client" },
  });
};

export default apolloClient;
