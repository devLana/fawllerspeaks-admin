import { useApolloClient } from "@apollo/client";
import { GET_CACHED_POST_TAGS } from "../GetPostTags/operations/GET_CACHED_POST_TAGS";

export const useGetCachePostTags = () => {
  const client = useApolloClient();
  const cachedTags = client.readQuery({ query: GET_CACHED_POST_TAGS });

  return cachedTags?.getPostTags.tags;
};
