import { useApolloClient } from "@apollo/client";
import { GET_CACHE_POST_TAGS } from "../operations/GET_CACHE_POST_TAGS";

export const useGetCachePostTags = () => {
  const client = useApolloClient();
  const cachePostTags = client.readQuery({ query: GET_CACHE_POST_TAGS });

  return cachePostTags?.getPostTags.tags;
};
