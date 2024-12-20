import type { PostData } from ".";
import type { PostToEditData } from "./editPost";
import type { Post, Query } from "@apiTypes";

type GetPostDataHelper<T extends object> = T extends { post: Post }
  ? Omit<T, "post" | "status"> & { post: PostData | PostToEditData }
  : Omit<T, "status">;

type GetPostDataMapper<T extends Record<string, object>> = {
  [Key in keyof T]: GetPostDataHelper<T[Key]>;
};

export type GetPostData = GetPostDataMapper<Pick<Query, "getPost">>;
