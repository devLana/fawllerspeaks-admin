import type { Post } from "@apiTypes";
import type { PostData, PostItemSlug } from "..";

type DataKeys = "__typename" | "id" | "isBinned" | "binnedAt" | "status";

type BinnedPostData = Pick<PostData, DataKeys> & {
  url: PostItemSlug;
};

type BinnedPostDataHelper<T extends object> = T extends { posts: Post[] }
  ? Omit<T, "posts" | "status"> & { posts: BinnedPostData[] }
  : Omit<T, "status">;

export type BinnedPostDataMapper<T extends Record<string, object>> = {
  [Key in keyof T]: BinnedPostDataHelper<T[Key]>;
};
