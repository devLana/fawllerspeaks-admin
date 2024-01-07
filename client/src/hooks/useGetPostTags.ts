import { useQuery } from "@apollo/client";
import { GET_POST_TAGS } from "@features/postTags/GetPostTags/operations/GET_POST_TAGS";

const useGetPostTags = () => {
  const { data, loading, error } = useQuery(GET_POST_TAGS);
  return { data, loading, error };
};

export default useGetPostTags;
