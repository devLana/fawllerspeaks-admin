import type { useMutation } from "@apollo/client/react";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon";
import type { SxProps } from "@mui/material/styles";
import type { SlideProps } from "@mui/material/Slide";

export type PageLayoutFn = (
  page: React.ReactElement,
  isVerifying: boolean,
  errorMessage: string | null,
) => React.ReactElement;

export interface MetadataProps {
  title: string;
  description?: string;
}

export type MuiIconType = OverridableComponent<SvgIconTypeMap>;

export type FunctionLike = (...args: never[]) => unknown;
type SxTypeKeys = FunctionLike | Record<string, unknown>;
export type SxPropArray = NonNullable<Exclude<SxProps, SxTypeKeys>>;
export type StateSetterFn<T> = React.Dispatch<React.SetStateAction<T>>;
export type Status = "idle" | "error" | "loading";
export type TransitionProps = Omit<SlideProps, "direction">;

export type MutateOption<
  D extends object,
  V extends object,
  O extends keyof useMutation.Options,
> = useMutation.Options<D, V>[O];

export type RefetchQueriesFn<D extends object, V extends object> = Extract<
  MutateOption<D, V, "refetchQueries">,
  FunctionLike
>;

export type OptimisticResponseFn<D extends object, V extends object> = Extract<
  MutateOption<D, V, "optimisticResponse">,
  FunctionLike
>;

export type MockFunc = (...args: unknown[]) => void;

export type TypeMapper<T extends object> = {
  [Key in keyof T]: T[Key] | { __typename: "UnsupportedType" };
};
