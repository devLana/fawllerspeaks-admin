import type { Mutation } from "@apiTypes";
import type {
  PostDataMapper,
  PostView,
  PostMetadataFields as Fields,
  PostInputData,
  PostActionStatus,
  PostMetadataFields,
} from ".";
import type { StateSetterFn } from "@types";

export type CreatePostGQLData = PostDataMapper<Pick<Mutation, "createPost">>;
export type DraftPostData = PostDataMapper<Pick<Mutation, "draftPost">>;
export type StoragePostData = Partial<Omit<PostInputData, "imageBanner">>;

export type CreatePostRemoveNull<T extends object> = {
  [Prop in keyof T]: NonNullable<T[Prop]>;
};

export interface CreatePostStateData {
  view: PostView;
  showStoragePostAlert: boolean;
  postData: PostInputData;
}

export type CreatePostAction =
  | { type: "GO_BACK_TO_METADATA" }
  | { type: "GO_BACK_TO_CONTENT" }
  | { type: "PROCEED_TO_POST_CONTENT"; payload: { metadata: Fields } }
  | { type: "ADD_POST_CONTENT"; payload: { content: string } }
  | { type: "PREVIEW_POST" }
  | { type: "SHOW_STORAGE_POST_ALERT" }
  | { type: "HIDE_STORAGE_POST_ALERT" }
  | { type: "LOAD_STORAGE_POST"; payload: { post: StoragePostData } };

export type CreatePostFieldErrors = {
  [Prop in keyof PostInputData as `${Prop}Error`]?: string;
};

interface HookReturnData {
  msg: string;
  errors: CreatePostFieldErrors;
  status: PostActionStatus;
  handleHideErrors: VoidFunction;
}

export interface DraftHookReturnData extends HookReturnData {
  handleDraftPost: (metadata?: PostMetadataFields) => Promise<void>;
}

export interface CreateHookReturnData extends HookReturnData {
  isOpen: boolean;
  handleCreatePost: () => Promise<void>;
  setIsOpen: StateSetterFn<boolean>;
}
