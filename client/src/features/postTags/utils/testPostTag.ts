import type { PostTagData } from "@types";

export const testPostTag = (name: string, id: string): PostTagData => ({
  __typename: "PostTag",
  id,
  name,
});
