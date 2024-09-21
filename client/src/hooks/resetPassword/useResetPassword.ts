import * as React from "react";
import { useRouter } from "next/router";

import type { Mutation, MutationResetPasswordArgs } from "@apiTypes";
import type { AuthPageView, OnCompleted, StateSetterFn, Status } from "@types";
import type { UseFormSetError } from "react-hook-form";

const useResetPassword = (
  setError: UseFormSetError<Omit<MutationResetPasswordArgs, "token">>,
  setView: StateSetterFn<AuthPageView>
) => {
  const [formStatus, setFormStatus] = React.useState<Status>("idle");
  const { push } = useRouter();

  const onCompleted: OnCompleted<Pick<Mutation, "resetPassword">> = data => {
    switch (data.resetPassword.__typename) {
      case "ResetPasswordValidationError": {
        const focus = { shouldFocus: true };

        const {
          passwordError,
          confirmPasswordError: confirmPwdErr,
          tokenError,
        } = data.resetPassword;

        if (tokenError) {
          void push("/forgot-password?status=validation");
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

      case "NotAllowedError":
        void push("/forgot-password?status=fail");
        break;

      case "RegistrationError":
        setView("unregistered error");
        break;

      case "Response":
        setView("success");
        break;

      default:
        void push("/forgot-password?status=unsupported");
    }
  };

  return { formStatus, setFormStatus, onCompleted };
};

export default useResetPassword;
