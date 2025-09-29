import type { PostStatus } from "@apiTypes";

export const unpublishPostRegex = new RegExp(
  '^getPosts\\(([^)]*"status":"(?:Published|Unpublished)"[^)]*)\\)$'
);

export const binPostsRegex = (status: PostStatus) => {
  return new RegExp(
    `^getPosts\\(([^)]*?"status":"${status}"[^)]*|(?!.*?"status":"[^"]+")[^)]*)\\)$`
  );
};
