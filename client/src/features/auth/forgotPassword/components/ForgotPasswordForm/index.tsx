import { useState } from "react";

import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useToast } from "@hooks/common/useToast";
import { useForm } from "@hooks/common/useForm";
import Down from "@components/SlideTransitions/Down";
import { FORGOT_PASSWORD } from "@mutations/auth/forgotPassword";
import { forgotPasswordSchema as schema } from "@validators/forgotPasswordSchema";

const ForgotPasswordForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);
  const showToast = useToast();

  const { errors, handleSubmit, register } = useForm({
    schema,
    onSubmit(variables, { setErrors }) {
      const toastOptions = {
        severity: "error",
        placement: { horizontal: "center", vertical: "top" },
        transition: Down,
      } as const;

      setIsLoading(true);

      forgotPassword({ variables })
        .then(({ data }) => {
          switch (data?.forgotPassword.__typename) {
            case "EmailValidationError": {
              const { emailError } = data.forgotPassword;
              setErrors({ email: emailError });
              break;
            }

            case "ForbiddenError":
            case "ServerError": {
              const msg = data.forgotPassword.message;
              showToast({ ...toastOptions, key: msg, content: msg });
              break;
            }

            case "Response":
              onSuccess();
              break;

            default:
              throw new Error("Unsupported object type received");
          }
        })
        .catch((err: unknown) => {
          let MSG = `You are unable to reset your password at this time. Please try again later`;

          if (CombinedGraphQLErrors.is(err)) {
            MSG = err.errors[0].message;
          } else if (
            err instanceof TypeError &&
            err.message === "Failed to fetch"
          ) {
            MSG = "The server is currently unreachable. Please try again later";
          }

          showToast({ ...toastOptions, key: MSG, content: MSG });
        })
        .finally(() => setIsLoading(false));
    },
  });

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
          formHelperText: { id: "error" },
          htmlInput: {
            "aria-errormessage": errors.email ? "error" : undefined,
            "aria-describedby": errors.email ? "error" : undefined,
          },
        }}
      />
      <Button
        fullWidth
        type="submit"
        size="large"
        variant="contained"
        loading={isLoading}
        sx={{ textTransform: "uppercase", mt: 3 }}
      >
        Get Reset Link
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
