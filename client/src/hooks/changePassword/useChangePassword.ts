import * as React from "react";
import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client";
import type { UseFormReset, UseFormSetError } from "react-hook-form";

import { SESSION_ID } from "@utils/constants";
import type { Mutation, MutationChangePasswordArgs } from "@apiTypes";
import type { OnCompleted, Status } from "@types";

type RequestStatus = Status | "success";

const useChangePassword = (
  setError: UseFormSetError<MutationChangePasswordArgs>,
  reset: UseFormReset<MutationChangePasswordArgs>
) => {
  const [formStatus, setFormStatus] = React.useState<RequestStatus>("idle");
  const { replace, pathname } = useRouter();

  const client = useApolloClient();

  const onCompleted: OnCompleted<Pick<Mutation, "changePassword">> = data => {
    switch (data.changePassword.__typename) {
      case "ChangePasswordValidationError": {
        const fieldErrors = data.changePassword;
        const focus = { shouldFocus: true };

        if (fieldErrors.confirmNewPasswordError) {
          const message = fieldErrors.confirmNewPasswordError;
          setError("confirmNewPassword", { message }, focus);
        }

        if (fieldErrors.newPasswordError) {
          const message = fieldErrors.newPasswordError;
          setError("newPassword", { message }, focus);
        }

        if (fieldErrors.currentPasswordError) {
          const message = fieldErrors.currentPasswordError;
          setError("currentPassword", { message }, focus);
        }

        setFormStatus("idle");
        break;
      }

      case "AuthenticationError": {
        const query = { status: "unauthenticated", redirectTo: pathname };

        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void replace({ pathname: "/login", query });
        break;
      }

      case "UnknownError":
        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void replace({ pathname: "/login", query: { status: "unauthorized" } });
        break;

      case "RegistrationError": {
        const query = { status: "unregistered", redirectTo: pathname };
        void replace({ pathname: "/register", query });
        break;
      }

      case "NotAllowedError":
      case "ServerError":
      default:
        setFormStatus("error");
        break;

      case "Response":
        setFormStatus("success");
        reset();
    }
  };

  return { formStatus, setFormStatus, onCompleted };
};

export default useChangePassword;
