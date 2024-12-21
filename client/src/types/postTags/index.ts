import type { PostTag } from "@apiTypes";

export type PostTagData = Omit<PostTag, "dateCreated" | "lastModified">;

type PostTagDataHelper<T extends object> = T extends { tags: PostTag[] }
  ? Omit<T, "tags" | "status"> & { tags: PostTagData[] }
  : T extends { tag: PostTag }
  ? Omit<T, "tag" | "status"> & { tag: PostTagData }
  : Omit<T, "status">;

export type PostTagDataMapper<T extends Record<string, object>> = {
  [Key in keyof T]: PostTagDataHelper<T[Key]>;
};
