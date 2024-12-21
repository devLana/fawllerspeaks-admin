import type { Mutation } from "@apiTypes";
import type { AuthPageView, RemoveApiStatusMapper as Mapper } from "@types";

export interface Verified {
  verified: { email: string; resetToken: string };
  isUnregistered?: never;
}

export interface PageView {
  isUnregistered: true;
  verified?: never;
}

export type ResetPasswordPageData = Verified | PageView;
export type View = AuthPageView | "warn";

export interface ResetPasswordFormProps {
  email: string;
  resetToken: string;
  handleView: (view: Exclude<View, "form">) => void;
}

type Helper<T extends object> = T extends { __typename?: "Response" }
  ? T
  : Omit<T, "status">;

type TMapper<T extends Record<string, object>> = {
  [Key in keyof T]: Helper<T[Key]>;
};

export type ResetPasswordData = TMapper<Pick<Mutation, "resetPassword">>;
export type VerifyResetTokenData = Mapper<Pick<Mutation, "verifyResetToken">>;
