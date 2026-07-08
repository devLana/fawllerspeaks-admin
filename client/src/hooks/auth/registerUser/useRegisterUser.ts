import { useState } from "react";
import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

import { useToast } from "@hooks/common/useToast";
import Down from "@components/SlideTransitions/Down";
import type {
  RegisterUserMutation as Data,
  RegisterUserMutationVariables as Vars,
} from "@appTypes/graphql";
import type { MutateOption } from "@appTypes";

interface Errors {
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
}

type OnError = MutateOption<Data, Vars, "onError">;
type OnCompleted = (
  setErrors: (errors: Errors) => void,
) => MutateOption<Data, Vars, "onCompleted">;

export const useRegisterUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { replace, query } = useRouter();

  const client = useApolloClient();
  const toast = useToast();

  const onError: OnError = err => {
    let MSG = `You cannot register your account at this time. Please try again later`;

    if (CombinedGraphQLErrors.is(err)) {
      MSG = err.errors[0].message;
    } else if (err instanceof TypeError && err.message === "Failed to fetch") {
      MSG = "The server is currently unreachable. Please try again later";
    }

    setIsLoading(false);
    toast({
      key: MSG,
      content: MSG,
      severity: "error",
      placement: { horizontal: "center", vertical: "top" },
      transition: Down,
    });
  };

  const onCompleted: OnCompleted = setErrors => data => {
    switch (data.registerUser.__typename) {
      case "RegisterUserValidationError":
        setErrors({
          firstName: data.registerUser.firstNameError ?? undefined,
          lastName: data.registerUser.lastNameError ?? undefined,
          password: data.registerUser.passwordError ?? undefined,
          confirmPassword: data.registerUser.confirmPasswordError ?? undefined,
        });
        setIsLoading(false);
        break;

      case "UnauthorizedError":
        void client.clearStore();
        void replace({ pathname: "/login", query: { status: "unauthorized" } });
        break;

      case "RegistrationError":
        void replace({ pathname: "/", query: { status: "registered" } });
        break;

      case "RegisteredUser": {
        const { redirectTo: to } = query;

        const regex =
          /^\/?(?:register|login|forgot-password|reset-password|404|500)/;

        if (typeof to === "string" && to !== "" && !regex.test(to)) {
          void replace(to);
        } else {
          void replace("/");
        }

        break;
      }

      default: {
        const MSG = `You cannot register your account at this time. Please try again later`;
        setIsLoading(false);
        toast({
          key: MSG,
          content: MSG,
          severity: "error",
          placement: { horizontal: "center", vertical: "top" },
          transition: Down,
        });
      }
    }
  };

  return { isLoading, onCompleted, onError, setIsLoading };
};
