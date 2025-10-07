import type { PostStatus } from "@apiTypes";

export const editPostRegex = (oldStatus: PostStatus, newStatus: PostStatus) => {
  const status =
    oldStatus === newStatus ? newStatus : `${newStatus}|${oldStatus}`;

  return new RegExp(
    `^getPosts\\(([^)]*?"status":"(?:${status})"[^)]*|.*?"sort":"title_(?:asc|desc)"(?!.*?"status":"[^"]+")[^)]*)\\)$`
  );
};
