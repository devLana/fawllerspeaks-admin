import type { MockedResponse } from "@apollo/client/testing";

import { GET_POST_TAGS } from "../GetPostTags/operations/GET_POST_TAGS";
import type { PostTag } from "@apiTypes";

export const getTestPostTags = (tags: PostTag[] = []): MockedResponse => ({
  request: { query: GET_POST_TAGS },
  result: { data: { getPostTags: { __typename: "PostTags", tags } } },
});
