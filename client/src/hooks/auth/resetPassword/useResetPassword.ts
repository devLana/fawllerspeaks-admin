import * as React from "react";
import { useRouter } from "next/router";

import type { MutationResetPasswordArgs } from "@appTypes/graphql";
import type { OnCompleted, Status } from "@appTypes";
import type { UseFormSetError } from "react-hook-form";
import type { ResetPasswordData } from "@appTypes/auth/resetPassword";

const useResetPassword = (
  setError: UseFormSetError<Omit<MutationResetPasswordArgs, "token">>,
  onSuccess: () => void,
) => {
  const [formStatus, setFormStatus] = React.useState<Status>("idle");
  const { push } = useRouter();

  const onCompleted: OnCompleted<ResetPasswordData> = data => {
    switch (data.resetPassword.__typename) {
      case "ResetPasswordValidationError": {
        const focus = { shouldFocus: true };
        const query = { status: "validation" };

        const {
          passwordError,
          confirmPasswordError: confirmPwdErr,
          tokenError,
        } = data.resetPassword;

        if (tokenError) {
          void push({ pathname: "/forgot-password", query });
          return;
        }

        if (confirmPwdErr) {
          setError("confirmPassword", { message: confirmPwdErr }, focus);
        }

        if (passwordError) {
          setError("password", { message: passwordError }, focus);
        }

        setFormStatus("idle");
        break;
      }

      case "ForbiddenError":
        void push({ pathname: "/forgot-password", query: { status: "fail" } });
        break;

      case "Response":
        onSuccess();
        break;

      default: {
        const query = { status: "unsupported" };
        void push({ pathname: "/forgot-password", query });
      }
    }
  };

  return { formStatus, setFormStatus, onCompleted };
};

export default useResetPassword;
