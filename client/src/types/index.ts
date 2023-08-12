import type { NextPage } from "next";
import { type AppProps } from "next/app";

import { type EmotionCache } from "@emotion/react";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon/SvgIcon";
import type { SxProps } from "@mui/material/styles";

import { type MetaInfo } from "@components/Metadata";

export type AppTheme = "sunny" | "sunset" | "pitch black";
export type CapitalizeAppTheme = "Sunny" | "Sunset" | "Pitch Black";

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
