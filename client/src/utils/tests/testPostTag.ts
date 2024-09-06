import type { PostTagData } from "@features/postTags/types";

export const testPostTag = (name: string, id: string): PostTagData => ({
  __typename: "PostTag",
  id,
  name,
});
