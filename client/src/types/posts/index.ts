import type { Query, Mutation, Post } from "@apiTypes";
import type { PostTagData } from "types/postTags";

export type ModifiedPost = Omit<Post, "tags"> & { tags?: PostTagData[] | null };

type PostDataHelper<T extends object> = T extends { posts: Post[] }
  ? Omit<T, "posts"> & { posts: ModifiedPost[] }
  : T extends { post: Post }
  ? Omit<T, "post"> & { post: ModifiedPost }
  : T;

type PostDataMapper<T extends Record<string, object>> = {
  [Key in keyof T]: PostDataHelper<T[Key]>;
};

export type CreatePostGQLData = PostDataMapper<Pick<Mutation, "createPost">>;
export type DraftPostData = PostDataMapper<Pick<Mutation, "draftPost">>;
export type GetPostData = PostDataMapper<Pick<Query, "getPost">>;
