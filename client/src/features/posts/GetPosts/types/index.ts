import type { GetPosts, GetPostsData, Post } from "@apiTypes";
import type { ModifiedPost } from "@features/posts/types";

type PostsPageDataKeys =
  | "id"
  | "title"
  | "imageBanner"
  | "status"
  | "dateCreated";

type ValidationErrorKeys =
  | "qError"
  | "sortError"
  | "typeError"
  | "statusError"
  | "postTagError";

export type PostsView = "list" | "grid";

export type PostItemSlug = Pick<ModifiedPost["url"], "slug">;

type PostsPageData = Pick<ModifiedPost, PostsPageDataKeys> & {
  url: PostItemSlug;
};

type PostsPageDataMapper<T extends object> = T extends { posts: Post[] }
  ? Omit<T, "posts" | "status"> & { posts: PostsPageData[] }
  : T extends { __typename?: "GetPostsValidationError" }
  ? Omit<T, ValidationErrorKeys>
  : T;

export interface GetPostsPageData {
  getPosts: PostsPageDataMapper<GetPosts>;
}

export type PostsData = PostsPageDataMapper<GetPostsData>;
