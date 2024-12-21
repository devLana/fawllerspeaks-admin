import * as React from "react";

import type { UseFormSetError } from "react-hook-form";

import type { ForgotPasswordData } from "types/auth/forgotPassword";
import type { MutationForgotPasswordArgs } from "@apiTypes";
import type { AuthPageView, OnCompleted, Status } from "@types";

const useForgotPassword = (
  setError: UseFormSetError<MutationForgotPasswordArgs>,
  handleView: (view: Exclude<AuthPageView, "form">) => void
) => {
  const [formStatus, setFormStatus] = React.useState<Status>("idle");

  const onCompleted: OnCompleted<ForgotPasswordData> = data => {
    switch (data.forgotPassword.__typename) {
      case "EmailValidationError": {
        const { emailError } = data.forgotPassword;

        setError("email", { message: emailError }, { shouldFocus: true });
        setFormStatus("idle");
        break;
      }

      case "NotAllowedError":
      case "ServerError":
      default:
        setFormStatus("error");
        break;

      case "RegistrationError":
        handleView("unregistered error");
        break;

      case "Response":
        handleView("success");
        break;
    }
  };

  return { formStatus, setFormStatus, onCompleted };
};

export default useForgotPassword;
