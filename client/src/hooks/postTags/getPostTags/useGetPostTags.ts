import { useQuery } from "@apollo/client/react";

import { GET_POST_TAGS } from "@queries/postTags/GET_POST_TAGS";
import type { GetPostTagsData } from "@appTypes/postTags/getPostTags";

const useGetPostTags = (options?: useQuery.Options<GetPostTagsData>) => {
  return useQuery(GET_POST_TAGS, options);
};

export default useGetPostTags;
