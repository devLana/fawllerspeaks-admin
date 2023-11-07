import type { NextPage } from "next";
import { type AppProps } from "next/app";

import { type EmotionCache } from "@emotion/react";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon/SvgIcon";
import type { SxProps } from "@mui/material/styles";

import { type MetaInfo } from "@components/Metadata";
import type { Query } from "@apiTypes";

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

type Keys = ((theme: never) => unknown) | Record<string, unknown>;
export type SxPropsArray = NonNullable<Exclude<SxProps, Keys>>;

type ExtractPostTags = Extract<Query["getPostTags"], { tags: unknown[] }>;
export interface CachePostTags {
  getPostTags: Omit<ExtractPostTags, "status" | "__typename">;
}
