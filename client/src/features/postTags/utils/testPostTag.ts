import type { PostTag } from "@apiTypes";

export const testPostTag = (name: string, id: string): PostTag => ({
  __typename: "PostTag",
  id,
  name,
  dateCreated: new Date().toISOString(),
  lastModified: null,
});
