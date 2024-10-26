import type { PostTag } from "@apiTypes";

export type PostTagData = Omit<PostTag, "dateCreated" | "lastModified">;

type PostTagDataHelper<T extends object> = T extends { tags: PostTag[] }
  ? Omit<T, "tags"> & { tags: PostTagData[] }
  : T extends { tag: PostTag }
  ? Omit<T, "tag"> & { tag: PostTagData }
  : T;

export type PostTagDataMapper<T extends Record<string, object>> = {
  [Key in keyof T]: PostTagDataHelper<T[Key]>;
};
