import { useQuery, type QueryHookOptions } from "@apollo/client";

import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import type { GetPostTagsData } from "types/postTags/getPostTags";

const useGetPostTags = (options?: QueryHookOptions<GetPostTagsData>) => {
  return useQuery(GET_POST_TAGS, options);
};

export default useGetPostTags;
