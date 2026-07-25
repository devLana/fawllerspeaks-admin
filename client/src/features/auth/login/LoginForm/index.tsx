import { useState } from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useAuth } from "@hooks/common/useAuth";
import { useForm } from "@hooks/common/useForm";
import { useToast } from "@hooks/common/useToast";
import PasswordInput from "@components/ui/PasswordInput";
import Down from "@components/SlideTransitions/Down";
import { LOGIN } from "@mutations/auth/login";
import { loginSchema as schema } from "@validators/loginSchema";
import { loginUpdate as update } from "@cache/update/auth/login";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push, query, replace } = useRouter();
  const [login] = useMutation(LOGIN);

  const { handleAuthHeader } = useAuth();
  const showToast = useToast();

  const { register, handleSubmit, errors } = useForm({
    schema,
    async onSubmit(variables, { setErrors }) {
      const toastOptions = {
        placement: { horizontal: "center", vertical: "top" },
        severity: "error",
        transition: Down,
      } as const;

      setIsLoading(true);

      try {
        const { data } = await login({ variables, update });

        switch (data?.login.__typename) {
          case "LoginValidationError": {
            setIsLoading(false);
            setErrors({
              email: data.login.emailError ?? undefined,
              password: data.login.passwordError ?? undefined,
            });
            break;
          }

          case "ForbiddenError": {
            const { message } = data.login;
            showToast({ ...toastOptions, key: message, content: message });
            setIsLoading(false);
            break;
          }

          case "SessionData": {
            const { accessToken, user } = data.login;
            const { redirectTo: to } = query;

            const regex =
              /^\/?(?:register|login|forgot-password|reset-password|404|500)/;

            if (!user.isRegistered) {
              void replace("/register");
            } else if (typeof to === "string" && to !== "" && !regex.test(to)) {
              void push(to);
            } else {
              void push("/");
            }

            handleAuthHeader(accessToken);
            break;
          }

          default:
            throw new Error("Unsupported object response received");
        }
      } catch (e) {
        let msg = "You can't login at this time. Please try again later";

        if (CombinedGraphQLErrors.is(e)) {
          msg = e.errors[0].message;
        } else if (e instanceof TypeError && e.message === "Failed to fetch") {
          msg = "The server is currently unreachable. Please try again later";
        }

        showToast({ ...toastOptions, key: msg, content: msg });
        setIsLoading(false);
      }
    },
  });

  const ID = errors.email ? "email-error-message" : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="page-title">
      <TextField
        {...register("email")}
        autoFocus
        fullWidth
        type="email"
        autoComplete="email"
        label="E-Mail"
        error={!!errors.email}
        helperText={errors.email ?? null}
        margin={errors.email ? "dense" : "normal"}
        slotProps={{
          formHelperText: { id: "email-error-message" },
          htmlInput: { "aria-errormessage": ID, "aria-describedby": ID },
        }}
      />
      <PasswordInput
        {...register("password")}
        label="Password"
        autoComplete="current-password"
        fieldError={errors.password}
        margin={errors.password ? "dense" : "normal"}
      />
      <Button
        loading={isLoading}
        variant="contained"
        size="large"
        type="submit"
        fullWidth
        sx={{ textTransform: "uppercase", mt: 3 }}
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
