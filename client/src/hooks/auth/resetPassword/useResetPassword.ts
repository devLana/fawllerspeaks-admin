import { useState } from "react";
import { useRouter } from "next/router";
import type { MutateOption } from "@appTypes";
import type { ResetPasswordMutationVariables as Vars } from "@appTypes/graphql";
import type { ResetPasswordData } from "@appTypes/auth/resetPassword";

type OnError = MutateOption<ResetPasswordData, Vars, "onError">;

type OnCompleted = (
  setErrors: (errors: { password?: string; confirmPassword?: string }) => void,
  onSuccess: () => void
) => MutateOption<ResetPasswordData, Vars, "onCompleted">;

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

  const onCompleted: OnCompleted = (setErrors, onSuccess) => data => {
    const query = { status: "error" };

    switch (data.resetPassword.__typename) {
      case "ResetPasswordValidationError": {
        if (data.resetPassword.tokenError) {
          void push({ pathname: "/forgot-password", query });
          return;
        }

        setErrors({
          confirmPassword: data.resetPassword.confirmPasswordError ?? undefined,
          password: data.resetPassword.passwordError ?? undefined,
        });
        setIsLoading(false);
        break;
      }

      case "ForbiddenError":
      default:
        void push({ pathname: "/forgot-password", query });
        break;

      case "Response":
        onSuccess();
    }
  };

  const onError: OnError = err => {
    let status = "error";

    if (err instanceof TypeError && err.message === "Failed to fetch") {
      status = "network";
    }

    void push({ pathname: "/forgot-password", query: { status } });
  };

  return { isLoading, setIsLoading, onCompleted, onError };
};
