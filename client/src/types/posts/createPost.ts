import type { CreatePostInput, Mutation, PostValidationError } from "@apiTypes";
import type { Status } from "@types";
import type { PostDataMapper } from ".";

export type CreatePostGQLData = PostDataMapper<Pick<Mutation, "createPost">>;
export type DraftPostData = PostDataMapper<Pick<Mutation, "draftPost">>;
export type CreateStatus = Status | "inputError";
export type PostView = "metadata" | "content" | "preview";

export interface PostImageBanner {
  file: File;
  blobUrl: string;
}

export type CreatePostData = Omit<CreatePostInput, "imageBanner" | "tagIds"> & {
  tagIds?: string[];
  imageBanner?: PostImageBanner;
};

export interface CreatePostState {
  view: PostView;
  showStoragePostAlert: boolean;
  postData: CreatePostData;
}

type RequiredMetadataKeys = "title" | "description" | "excerpt";
export type RequiredPostMetadata = Pick<CreatePostData, RequiredMetadataKeys>;
export type StoragePostData = Partial<Omit<CreatePostData, "imageBanner">>;

export type CreatePostAction =
  | { type: "CHANGE_VIEW"; payload: { view: PostView } }
  | { type: "MANAGE_POST_TAGS"; payload: { tagIds: string[] } }
  | { type: "ADD_POST_BANNER_IMAGE"; payload: { imageFile: File } }
  | { type: "REMOVE_POST_BANNER_IMAGE" }
  | {
      type: "ADD_REQUIRED_METADATA";
      payload: { metadata: RequiredPostMetadata };
    }
  | { type: "ADD_POST_CONTENT"; payload: { content: string } }
  | {
      type: "CHANGE_METADATA_FIELD";
      payload: { key: RequiredMetadataKeys; value: string };
    }
  | { type: "SHOW_STORAGE_POST_ALERT" }
  | { type: "HIDE_STORAGE_POST_ALERT" }
  | {
      type: "LOAD_STORAGE_POST";
      payload: { post: StoragePostData };
    };

export interface CKEditorComponentProps {
  id: string;
  data: string;
  contentHasError: boolean;
  dispatch: React.Dispatch<CreatePostAction>;
  onFocus: VoidFunction;
  onBlur: (value: boolean) => void;
}

type MetadataErrorKeys = "titleError" | "descriptionError" | "excerptError";
type CreateErrorParam = Pick<PostValidationError, MetadataErrorKeys>;
type CreateErrorKeys = keyof Omit<PostValidationError, "__typename" | "status">;
export type DraftErrorCb = (errors: CreateErrorParam) => void;
export type CreateInputErrors = { [Key in CreateErrorKeys]?: string };

export type RemoveNull<T extends object> = {
  [Prop in keyof T]: NonNullable<T[Prop]>;
};
