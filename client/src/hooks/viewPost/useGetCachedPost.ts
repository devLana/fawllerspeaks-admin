import { useApolloClient } from "@apollo/client";
import { GET_CACHED_POST } from "@queries/viewPost/GET_CACHED_POST";

export const useGetCachedPost = (slug: string) => {
  const client = useApolloClient();

  const cachedPost = client.readQuery({
    query: GET_CACHED_POST,
    variables: { slug },
  });

  return cachedPost?.getPost.post;
};
