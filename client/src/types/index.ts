import type { NextPage } from "next";
import type { AppProps } from "next/app";

import type { BaseMutationOptions as MutationOptions } from "@apollo/client";
import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import type { EmotionCache } from "@emotion/react";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon/SvgIcon";
import type { SxProps } from "@mui/material/styles";
import type { Status as ApiStatus } from "@apiTypes";

export type PageLayoutFn = (
  page: React.ReactElement,
  clientHasRendered: boolean,
  errorMessage: string | null
) => React.ReactElement;

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & { layout: PageLayoutFn };

export interface NextAppProps extends AppProps {
  emotionCache?: EmotionCache;
  pageProps: Record<string, unknown>;
  Component: NextPageWithLayout;
}

export type MuiIconType = OverridableComponent<SvgIconTypeMap> & {
  muiName: string;
};

export type FunctionLike = (...args: never[]) => unknown;
type SxTypeKeys = FunctionLike | Record<string, unknown>;
export type SxPropsArray = NonNullable<Exclude<SxProps, SxTypeKeys>>;
export type StateSetterFn<T> = React.Dispatch<React.SetStateAction<T>>;
export type AuthPageView = "form" | "unregistered error" | "success";
export type Status = "idle" | "error" | "loading";

export type RefetchQueriesFn<T extends object> = Extract<
  MutationBaseOptions<T>["refetchQueries"],
  FunctionLike
>;

export type OnCompleted<T extends object> = MutationOptions<T>["onCompleted"];
export type OnError = MutationOptions["onError"];

type RemoveApiStatusHelper<T extends object> = T extends { status: ApiStatus }
  ? Omit<T, "status">
  : T;

export type RemoveApiStatusMapper<T extends Record<string, object>> = {
  [Key in keyof T]: RemoveApiStatusHelper<T[Key]>;
};
