import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
// import { SetContextLink } from "@apollo/client/link/context"

const apolloClient = (jwt?: string, cache = new InMemoryCache()) => {
  // const authLink = new SetContextLink(({}, operation) => {
  // });

  const link = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    ...(jwt && { headers: { authorization: `Bearer ${jwt}` } }),
  });

  return new ApolloClient({
    link,
    cache,
    ssrMode: false,
    devtools: { name: "fawllerspeaks_client" },
  });
};

export default apolloClient;
