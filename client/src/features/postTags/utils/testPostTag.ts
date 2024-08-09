import type { PostTagData } from "@types";

export const testPostTag = (
  name: string,
  id: string,
  tagId: number
): PostTagData => ({
  __typename: "PostTag",
  id,
  tagId,
  name,
});
