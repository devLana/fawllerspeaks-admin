import type { Post, PostStatus } from "@apiTypes";
import type { Status } from "@types";
import type { PostTagData } from "types/postTags";

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
  shouldSaveToStorage: boolean;
  onFocus: VoidFunction;
  onBlur: (value: boolean) => void;
  dispatchFn: (content: string) => void;
}

export interface PostViewHeaderProps {
  buttonLabel: string;
  status: PostStatus;
  title: string;
  children: React.ReactElement;
  onClick: () => void;
}

type RequiredFieldErrorKeys = `${keyof RequiredPostMetadataFields}Error`;

export type RequiredFieldErrors = {
  [Key in RequiredFieldErrorKeys]?: string;
};
