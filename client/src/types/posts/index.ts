import type { Post } from "@apiTypes";
import type { PostTagData } from "types/postTags";

export type PostData = Omit<Post, "tags"> & { tags?: PostTagData[] | null };

type PostDataHelper<T extends object> = T extends { posts: Post[] }
  ? Omit<T, "posts" | "status"> & { posts: PostData[] }
  : T extends { post: Post }
  ? Omit<T, "post" | "status"> & { post: PostData }
  : Omit<T, "status">;

export type PostDataMapper<T extends Record<string, object>> = {
  [Key in keyof T]: PostDataHelper<T[Key]>;
};
