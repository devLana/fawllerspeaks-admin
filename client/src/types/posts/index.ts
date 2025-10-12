import type { ApolloCache, Reference } from "@apollo/client";
import type { BoxProps } from "@mui/material/Box";

import type CustomEditor from "ckeditor5-custom-build";
import type { Status } from "@types";
import type { PostTagData } from "types/postTags";
import type { PostsPageData } from "./getPosts";
import type { Post, PostStatus, QueryGetPostsArgs } from "@apiTypes";

export type PostData = Omit<Post, "tags"> & { tags?: PostTagData[] | null };

type PostDataHelper<T extends object> = T extends { posts: Post[] }
  ? Omit<T, "posts" | "status"> & { posts: PostData[] }
  : T extends { post: Post }
  ? Omit<T, "post" | "status"> & { post: PostData }
  : Omit<T, "status">;

export type PostDataMapper<T extends Record<string, object>> = {
  [Key in keyof T]: PostDataHelper<T[Key]>;
};

export type PostView = "metadata" | "content" | "preview";
export type PostActionStatus = Status | "inputError";

export type RequiredPostMetadataFields = Record<
  "title" | "description" | "excerpt",
  string
>;

export interface PostMetadataFields extends RequiredPostMetadataFields {
  tagIds: string[];
  imageBanner: File | null;
}

export interface PostInputData extends PostMetadataFields {
  content: string;
}

export interface CKEditorComponentProps {
  id: string;
  data: string;
  contentHasError: boolean;
  savedImageUrlsRef: React.MutableRefObject<Set<string>>;
  handleChange: (editorRef: CustomEditor) => void;
  onFocus: VoidFunction;
  onBlur: (value: boolean) => void;
  dispatchFn: (content: string) => void;
}

type EditorKeys = "id" | "contentHasError" | "onFocus" | "onBlur";

export interface PostContentEditorProps
  extends Pick<CKEditorComponentProps, EditorKeys> {
  content: string;
}

export interface PostViewHeaderProps {
  buttonLabel: string;
  status: PostStatus;
  title: string;
  children: React.ReactElement | null;
  onClick: () => void;
  status_menu_sx?: BoxProps["sx"];
}

type RequiredFieldErrorKeys = `${keyof RequiredPostMetadataFields}Error`;

export type RequiredFieldErrors = {
  [Key in RequiredFieldErrorKeys]?: string;
};

export type PostItemSlug = Pick<PostData["url"], "slug" | "__typename">;

export interface GetPostsFieldsMapData {
  args: QueryGetPostsArgs;
  fieldData: Omit<PostsPageData, "posts"> & { posts: Reference[] };
}

export interface EvictSubsequentGetPostsFieldsOptions
  extends GetPostsFieldsMapData {
  cache: ApolloCache<unknown>;
  getPostsMap: Map<string, GetPostsFieldsMapData>;
  slug: string;
}

export interface EvictGetPostsFieldsOptions
  extends EvictSubsequentGetPostsFieldsOptions {
  newStatus: PostStatus;
  oldStatus: PostStatus;
}
