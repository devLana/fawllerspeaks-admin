import * as React from "react";
import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client";
import type { UseFormSetError } from "react-hook-form";

import { SESSION_ID } from "@utils/constants";
import type { Mutation, MutationRegisterUserArgs } from "@apiTypes";
import type { OnCompleted, Status } from "@types";

type RegisterUserArgs = MutationRegisterUserArgs["userInput"];

const useRegisterUser = (setError: UseFormSetError<RegisterUserArgs>) => {
  const [formStatus, setFormStatus] = React.useState<Status>("idle");
  const { replace, query } = useRouter();

  const client = useApolloClient();

  const onCompleted: OnCompleted<Pick<Mutation, "registerUser">> = data => {
    switch (data.registerUser.__typename) {
      case "RegisterUserValidationError": {
        const {
          firstNameError,
          lastNameError,
          passwordError,
          confirmPasswordError: confirmPwdError,
        } = data.registerUser;
        const focus = { shouldFocus: true };

        if (confirmPwdError) {
          setError("confirmPassword", { message: confirmPwdError }, focus);
        }

        if (passwordError) {
          setError("password", { message: passwordError }, focus);
        }

        if (lastNameError) {
          setError("lastName", { message: lastNameError }, focus);
        }

        if (firstNameError) {
          setError("firstName", { message: firstNameError }, focus);
        }

        setFormStatus("idle");
        break;
      }

      case "AuthenticationError": {
        const params = { status: "unauthenticated" };

        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void replace({ pathname: "/login", query: params });
        break;
      }

      case "UnknownError":
        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void replace({ pathname: "/login", query: { status: "unauthorized" } });
        break;

      case "RegistrationError":
        void replace({ pathname: "/", query: { status: "registered" } });
        break;

      case "RegisteredUser": {
        const { redirectTo } = query;

        const regex =
          /^\/?(?:register|login|forgot-password|reset-password|404|500)/;

        if (typeof redirectTo === "string" && !regex.test(redirectTo)) {
          void replace(redirectTo);
        } else {
          void replace("/");
        }

        break;
      }

      default:
        setFormStatus("error");
        break;
    }
  };

  return { formStatus, setFormStatus, onCompleted };
};

export default useRegisterUser;
