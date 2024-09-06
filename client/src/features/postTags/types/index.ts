import type { Mutation, PostTag, Query } from "@apiTypes";

export type PostTagData = Omit<PostTag, "dateCreated" | "lastModified">;

type PostTagDataHelper<T extends object> = T extends { tags: PostTag[] }
  ? Omit<T, "tags"> & { tags: PostTagData[] }
  : T extends { tag: PostTag }
  ? Omit<T, "tag"> & { tag: PostTagData }
  : T;

type PostTagDataMapper<T extends Record<string, object>> = {
  [Key in keyof T]: PostTagDataHelper<T[Key]>;
};

export type EditPostTagData = PostTagDataMapper<Pick<Mutation, "editPostTag">>;
export type GetPostTagsData = PostTagDataMapper<Pick<Query, "getPostTags">>;

export type CreatePostTagsData = PostTagDataMapper<
  Pick<Mutation, "createPostTags">
>;

export type DeletePostTagsData = PostTagDataMapper<
  Pick<Mutation, "deletePostTags">
>;
