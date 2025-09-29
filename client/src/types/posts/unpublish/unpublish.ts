import type { Post } from "@apiTypes";
import type { PostData, PostItemSlug } from "..";

type UnpublishedPostData = Pick<PostData, "__typename" | "id" | "status"> & {
  url: PostItemSlug;
};

type UnpublishedPostDataHelper<T extends object> = T extends { post: Post }
  ? Omit<T, "post" | "status"> & { post: UnpublishedPostData }
  : Omit<T, "status">;

export type UnpublishedPostDataMapper<T extends Record<string, object>> = {
  [Key in keyof T]: UnpublishedPostDataHelper<T[Key]>;
};
