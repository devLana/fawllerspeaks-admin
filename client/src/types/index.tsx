import type { NextPage } from "next";
import type { AppProps } from "next/app";

import type { EmotionCache } from "@emotion/react";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon/SvgIcon";
import type { SxProps } from "@mui/material/styles";

import type { MetaInfo } from "@components/Metadata";
import type { Mutation, Post, PostTag, Query } from "@apiTypes";

/* General Project Types */
export type PageLayout = (
  page: React.ReactElement,
  clientHasRendered: boolean,
  errorMessage: string | null
) => React.ReactElement;

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & { layout: PageLayout };

export interface NextAppProps extends AppProps {
  emotionCache?: EmotionCache;
  pageProps: Record<string, unknown>;
  Component: NextPageWithLayout;
}

export type MuiIconType = OverridableComponent<SvgIconTypeMap> & {
  muiName: string;
};

export interface RootLayoutProps extends MetaInfo {
  errorMessage: string | null;
  clientHasRendered: boolean;
  children: React.ReactElement;
}

type Keys = ((...theme: never[]) => unknown) | Record<string, unknown>;
export type SxPropsArray = NonNullable<Exclude<SxProps, Keys>>;
export type StateSetterFn<T> = React.Dispatch<React.SetStateAction<T>>;
export type AuthPageView = "form" | "unregistered error" | "success";
export type Status = "idle" | "error" | "loading";
export type RequestStatus = Status | "success";

/* App Theme Types */
export type ThemeMode = "sunny" | "sunset" | "pitch black";
export type CapitalizeThemeMode = "Sunny" | "Sunset" | "Pitch Black";
export type ThemeColors = "#7dd1f3" | "#6a6a6a";

export interface AppTheme {
  themeMode: ThemeMode;
  fontSize: number;
  color: ThemeColors;
}

/* Edit Profile Feature Types */
export interface EditProfileFormProps {
  firstName: string;
  lastName: string;
  userImage: string;
}

export interface EditProfileImage {
  file: File | null;
  error: string;
  blobUrl: string;
}

/* Post Tags Feature Types */
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

interface EditPostTag {
  open: boolean;
  name: string;
  id: string;
}

interface DeletePostTag {
  open: boolean;
  name: string;
  ids: string[];
}

interface NameIdPayload {
  name: string;
  id: string;
}

export interface PostTagsListState {
  edit: EditPostTag;
  deleteTags: boolean;
  selectedTags: Record<string, string>;
  deleteTag: DeletePostTag;
}

export type PostTagsListAction =
  | { type: "OPEN_MENU_EDIT"; payload: NameIdPayload }
  | { type: "CLOSE_MENU_EDIT" }
  | { type: "POST_TAG_EDITED"; payload: NameIdPayload }
  | { type: "OPEN_MENU_DELETE"; payload: NameIdPayload }
  | { type: "CLOSE_MENU_DELETE" }
  | { type: "OPEN_MULTI_DELETE" }
  | { type: "CLOSE_MULTI_DELETE" }
  | { type: "CLICK_POST_TAG"; payload: { checked: boolean } & NameIdPayload }
  | { type: "CLEAR_SELECTION"; payload?: { deletedTags: string[] } }
  | {
      type: "SELECT_UNSELECT_ALL_CHECKBOX";
      payload: { checked: boolean; tags: PostTagData[] };
    }
  | {
      type: "CTRL_A_SELECT_ALL";
      payload: { tags: PostTagData[]; isNotAllSelected: boolean };
    }
  | {
      type: "SHIFT_PLUS_CLICK";
      payload: { anchorTagId: string; id: string; tags: PostTagData[] };
    };

/* Posts Feature Types */
export type PostView = "metadata" | "content" | "preview";

export interface PostData {
  title: string;
  description: string;
  content: string;
  imageBanner?: File;
  tags?: string[];
}

type ModifiedPost = Omit<Post, "tags"> & { tags?: PostTagData[] | null };

type PostDataHelper<T extends object> = T extends { posts: Post[] }
  ? Omit<T, "posts"> & { posts: ModifiedPost[] }
  : T extends { post: Post }
  ? Omit<T, "post"> & { post: ModifiedPost }
  : T;

type PostDataMapper<T extends Record<string, object>> = {
  [Key in keyof T]: PostDataHelper<T[Key]>;
};

export type DraftPostData = PostDataMapper<Pick<Mutation, "draftPost">>;
