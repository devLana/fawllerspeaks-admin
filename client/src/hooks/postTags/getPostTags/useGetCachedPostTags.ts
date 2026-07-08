import { useApolloClient } from "@apollo/client/react";
import { GET_CACHED_POST_TAGS } from "@queries/postTags/GET_CACHED_POST_TAGS";

export const useGetCachedPostTags = () => {
  const client = useApolloClient();
  const cachePostTags = client.readQuery({ query: GET_CACHED_POST_TAGS });

  return cachePostTags?.getPostTags.tags;
};
