import { useQuery, type QueryHookOptions } from "@apollo/client";

import { GET_POST_TAGS } from "../operations/GET_POST_TAGS";
import type { GetPostTagsData } from "@features/postTags/types";

const useGetPostTags = (options?: QueryHookOptions<GetPostTagsData>) => {
  return useQuery(GET_POST_TAGS, options);
};

export default useGetPostTags;
