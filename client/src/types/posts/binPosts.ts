import type { Mutation, Post } from "@apiTypes";
import type { PostData, PostItemSlug } from ".";

type DataKeys = "id" | "isBinned" | "binnedAt" | "status";

type BinnedPostData = Pick<PostData, DataKeys> & {
  url: PostItemSlug;
};

type BinnedPostDataHelper<T extends object> = T extends { posts: Post[] }
  ? Omit<T, "posts" | "status"> & { posts: BinnedPostData[] }
  : Omit<T, "status">;

type BinnedPostDataMapper<T extends Record<string, object>> = {
  [Key in keyof T]: BinnedPostDataHelper<T[Key]>;
};

export type BinPostsData = BinnedPostDataMapper<Pick<Mutation, "binPosts">>;
