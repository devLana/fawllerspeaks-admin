import type { AuthPageView } from "@types";

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
