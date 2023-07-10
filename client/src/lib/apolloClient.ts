import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = () => {
  const client = new ApolloClient({
    uri: "http://localhost:7692/",
    cache: new InMemoryCache(),
  });

  return client;
};

export default apolloClient;
