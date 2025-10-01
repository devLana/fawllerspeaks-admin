import type { PostStatus } from "@apiTypes";

export const unpublishPostRegex = new RegExp(
  '^getPosts\\(([^)]*"status":"(?:Published|Unpublished)"[^)]*)\\)$'
);

export const getPostsFieldsRegex = (status: PostStatus) => {
  return new RegExp(
    `^getPosts\\(([^)]*?"status":"${status}"[^)]*|(?!.*?"status":"[^"]+")[^)]*)\\)$`
  );
};
