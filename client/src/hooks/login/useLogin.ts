import * as React from "react";
import { useRouter } from "next/router";

import type { UseFormSetError } from "react-hook-form";

import { useSession } from "@context/Session";
import { useAuth } from "@context/Auth";
import { SESSION_ID } from "@utils/constants";
import type { LoginData } from "types/auth/login";
import type { MutationLoginArgs } from "@apiTypes";
import type { OnCompleted, Status } from "@types";

const useLogin = (setError: UseFormSetError<MutationLoginArgs>) => {
  const [formStatus, setFormStatus] = React.useState<Status>("idle");
  const { push, query, replace } = useRouter();

  const { handleUserId, handleRefreshToken } = useSession();
  const { handleAuthHeader } = useAuth();

  const onCompleted: OnCompleted<LoginData> = loginData => {
    switch (loginData.login.__typename) {
      case "LoginValidationError": {
        const focus = { shouldFocus: true };
        const { emailError, passwordError } = loginData.login;

        if (passwordError) {
          setError("password", { message: passwordError }, focus);
        }

        if (emailError) setError("email", { message: emailError }, focus);

        setFormStatus("idle");
        break;
      }

      case "NotAllowedError":
      default:
        setFormStatus("error");
        break;

      case "LoggedInUser": {
        const { __typename = "User", ...user } = loginData.login.user;
        const { redirectTo } = query;

        const regex =
          /^\/?(?:register|login|forgot-password|reset-password|404|500)/;

        if (!user.isRegistered) {
          void replace("/register");
        } else if (typeof redirectTo === "string" && !regex.test(redirectTo)) {
          void push(redirectTo);
        } else {
          void push("/");
        }

        localStorage.setItem(SESSION_ID, loginData.login.sessionId);
        handleAuthHeader(loginData.login.accessToken);
        handleRefreshToken(loginData.login.accessToken);
        handleUserId(`${__typename}:${user.id}`);
      }
    }
  };

  return { formStatus, setFormStatus, onCompleted };
};

export default useLogin;
