import type { PostStatus } from "@apiTypes";

export const getPostsFieldsRegex = (status: PostStatus) => {
  return new RegExp(
    `^getPosts\\(([^)]*?"status":"${status}"[^)]*|(?!.*?"status":"[^"]+")[^)]*)\\)$`
  );
};
