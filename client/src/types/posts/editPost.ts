import type { ApolloError } from "@apollo/client";

import type { Mutation, Post, Query } from "@apiTypes";
import type { GetPostTagsData } from "types/postTags/getPostTags";
import type {
  PostData,
  PostView,
  PostDataMapper,
  PostInputData,
  PostMetadataFields,
  PostContentEditorProps,
} from ".";

type EditPostKeys =
  | "__typename"
  | "id"
  | "title"
  | "description"
  | "excerpt"
  | "imageBanner"
  | "tags"
  | "status";

interface PostProps {
  content?: { __typename?: "PostContent"; html: string } | null;
  url: { __typename?: "PostUrl"; slug: string };
}

export type PostToEditData = Pick<PostData, EditPostKeys> & PostProps;

type GetPostToEditHelper<T extends object> = T extends { post: Post }
  ? Omit<T, "post" | "status"> & { post: PostToEditData }
  : Omit<T, "status">;

type GetPostToEditMapper<T extends Record<string, object>> = {
  [Key in keyof T]: GetPostToEditHelper<T[Key]>;
};

export type GetPostToEditData = GetPostToEditMapper<Pick<Query, "getPost">>;

export interface EditPostImageBanner {
  url: string | null;
  file: File | null;
}

export interface EditPostStateData extends Omit<PostInputData, "imageBanner"> {
  id: string;
  imageBanner: EditPostImageBanner;
  editStatus: boolean;
}

export interface EditPostState {
  view: PostView;
  postData: EditPostStateData;
  showStoragePostAlert: boolean;
}

export interface EditPostMetadataFields extends PostMetadataFields {
  editStatus: boolean;
}

export interface EditStoragePostData {
  id?: string;
  slug?: string;
  content?: string;
  imgUrls?: string[];
}

export type EditPostAction =
  | { type: "GO_BACK_TO_METADATA" }
  | { type: "GO_BACK_TO_CONTENT" }
  | { type: "REMOVE_IMAGE_BANNER_URL" }
  | {
      type: "PROCEED_TO_POST_CONTENT";
      payload: { metadata: EditPostMetadataFields };
    }
  | { type: "ADD_POST_CONTENT"; payload: { content: string } }
  | { type: "PREVIEW_POST" }
  | { type: "SHOW_EDIT_STORAGE_POST_ALERT" }
  | { type: "HIDE_EDIT_STORAGE_POST_ALERT" }
  | { type: "LOAD_EDIT_STORAGE_POST"; payload: { content?: string } };

export type EditPostData = PostDataMapper<Pick<Mutation, "editPost">>;

export interface PostTagsFetchData {
  data: GetPostTagsData | undefined;
  error: ApolloError | undefined;
  loading: boolean;
}

export type EditPostFieldErrors = {
  [Prop in keyof EditPostStateData as `${Prop}Error`]?: string;
};

export interface EditPostProps {
  id: string;
  post: PostToEditData;
  postTagsData: PostTagsFetchData;
  hasRenderedBeforeRef: boolean;
  onRendered: () => void;
}

export interface EditPostContentEditorProps extends PostContentEditorProps {
  dispatch: React.Dispatch<EditPostAction>;
}
