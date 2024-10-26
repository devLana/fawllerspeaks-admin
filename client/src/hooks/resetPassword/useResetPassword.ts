import * as React from "react";
import { useRouter } from "next/router";

import type { Mutation, MutationResetPasswordArgs } from "@apiTypes";
import type { OnCompleted, Status } from "@types";
import type { UseFormSetError } from "react-hook-form";
import type { View } from "types/resetPassword";

const useResetPassword = (
  setError: UseFormSetError<Omit<MutationResetPasswordArgs, "token">>,
  handleView: (view: Exclude<View, "form">) => void
) => {
  const [formStatus, setFormStatus] = React.useState<Status>("idle");
  const { push } = useRouter();

  const onCompleted: OnCompleted<Pick<Mutation, "resetPassword">> = data => {
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

      case "NotAllowedError":
        void push({ pathname: "/forgot-password", query: { status: "fail" } });
        break;

      case "RegistrationError":
        handleView("unregistered error");
        break;

      case "Response": {
        const { status } = data.resetPassword;
        handleView(status === "SUCCESS" ? "success" : "warn");
        break;
      }

      default: {
        const query = { status: "unsupported" };
        void push({ pathname: "/forgot-password", query });
      }
    }
  };

  return { formStatus, setFormStatus, onCompleted };
};

export default useResetPassword;
