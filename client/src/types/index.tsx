import type { NextPage } from "next";
import type { AppProps } from "next/app";

import type { EmotionCache } from "@emotion/react";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon/SvgIcon";
import type { SxProps } from "@mui/material/styles";

import type { MetaInfo } from "@components/Metadata";
import type { Mutation, Post, PostTag, Query } from "@apiTypes";

export type ThemeMode = "sunny" | "sunset" | "pitch black";
export type CapitalizeThemeMode = "Sunny" | "Sunset" | "Pitch Black";
export type ThemeColors = "#7dd1f3" | "#6a6a6a";

export interface AppTheme {
  themeMode: ThemeMode;
  fontSize: number;
  color: ThemeColors;
}

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

export type PostView = "metadata" | "content" | "preview";

export interface PostData {
  title: string;
  description: string;
  content: string;
  imageBanner?: File;
  tags?: string[];
}

export interface EditProfileImage {
  file: File | null;
  error: string;
  blobUrl: string;
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
