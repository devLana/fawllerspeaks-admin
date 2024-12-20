import type { Post, Query } from "@apiTypes";
import type { PostData } from ".";

type EditPostKeys =
  | "__typename"
  | "id"
  | "title"
  | "description"
  | "excerpt"
  | "imageBanner"
  | "tags"
  | "status";

interface Content {
  content?: { html: string } | null;
}

export type PostToEditData = Pick<PostData, EditPostKeys> & Content;

type GetPostToEditHelper<T extends object> = T extends { post: Post }
  ? Omit<T, "post" | "status"> & { post: PostToEditData }
  : Omit<T, "status">;

type GetPostToEditMapper<T extends Record<string, object>> = {
  [Key in keyof T]: GetPostToEditHelper<T[Key]>;
};

export type GetPostToEditData = GetPostToEditMapper<Pick<Query, "getPost">>;
