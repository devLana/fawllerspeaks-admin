import type { TypeMapper } from "@appTypes";
import type { ResetPasswordMutation } from "@appTypes/graphql";

export interface ResetPasswordPageData {
  email: string;
  resetToken: string;
}

export interface ResetPasswordFormProps {
  email: string;
  resetToken: string;
  onSuccess: () => void;
}

export type ResetPasswordData = TypeMapper<ResetPasswordMutation>;
