import * as React from "react";

import type { UseFormSetError } from "react-hook-form";

import type { Mutation, MutationForgotPasswordArgs } from "@apiTypes";
import type { AuthPageView, OnCompleted, StateSetterFn, Status } from "@types";

const useForgotPassword = (
  setError: UseFormSetError<MutationForgotPasswordArgs>,
  setView: StateSetterFn<AuthPageView>
) => {
  const [formStatus, setFormStatus] = React.useState<Status>("idle");

  const onCompleted: OnCompleted<Pick<Mutation, "forgotPassword">> = data => {
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
        setView("unregistered error");
        break;

      case "Response":
        setView("success");
        break;
    }
  };

  return { formStatus, setFormStatus, onCompleted };
};

export default useForgotPassword;
