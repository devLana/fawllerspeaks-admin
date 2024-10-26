import type { Cache } from "@apollo/client/cache/core/types/Cache";

import { GET_POST_TAGS } from "@queries/getPostTags/GET_POST_TAGS";
import { testPostTag } from "@utils/tests/testPostTag";
import type { GetPostTagsData } from "types/postTags/getPostTags";

const getTags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5"];
const tags = getTags.map((tag, idx) => testPostTag(tag, `id-${idx + 1}`));
export const regex = { name: /^delete post tag$/i };
export const selectAll = { name: /^select all post tags$/i };
export const unselectAll = { name: /^unselect all post tags$/i };
export const del1 = /^delete post tag - tag 5\|id-5$/i;
export const del2 = /^delete post tags - tag 1\|id-1,id-3,id-4$/i;

export const name = (index: number) => ({
  name: new RegExp(`^${getTags[index]}$`, "i"),
});

export const postTag = (index: number) => ({
  name: new RegExp(`^${getTags[index]} post tag$`, "i"),
});

export const btn = (value: string) => ({
  name: new RegExp(`^delete ${value} post tags$`, "i"),
});

export const edit = (index: number) => {
  const { id, name: tagName } = tags[index];
  return new RegExp(`^edit post tag - ${tagName}:${id}$`, "i");
};

export const writeTags: Cache.WriteQueryOptions<GetPostTagsData, object> = {
  query: GET_POST_TAGS,
  data: { getPostTags: { __typename: "PostTags", tags, status: "SUCCESS" } },
};
