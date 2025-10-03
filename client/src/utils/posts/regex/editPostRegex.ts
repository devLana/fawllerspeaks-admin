import type { PostStatus } from "@apiTypes";

export const editPostRegex = (oldStatus: PostStatus, newStatus: PostStatus) => {
  return new RegExp(
    `^getPosts\\(([^)]*?"status":"(?:${newStatus}|${oldStatus})"[^)]*|.*?"sort":"title_(?:asc|desc)"(?!.*?"status":"[^"]+")[^)]*)\\)$`
  );
};
