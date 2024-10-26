import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

import useForgotPassword from "@hooks/forgotPassword/useForgotPassword";
import AlertToast from "@features/auth/components/AlertToast";
import Down from "@components/SlideTransitions/Down";
import { FORGOT_PASSWORD } from "@mutations/forgotPassword/FORGOT_PASSWORD";
import { forgotPasswordSchema } from "@validators/forgotPasswordSchema";
import type { AuthPageView } from "@types";
import type { MutationForgotPasswordArgs as Args } from "@apiTypes";

interface ForgotPasswordFormProps {
  handleView: (view: Exclude<AuthPageView, "form">) => void;
}

const ForgotPasswordForm = ({ handleView }: ForgotPasswordFormProps) => {
  const [forgotPassword, { error, data }] = useMutation(FORGOT_PASSWORD);

  const { register, handleSubmit, formState, setError } = useForm<Args>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const { formStatus, setFormStatus, onCompleted } = useForgotPassword(
    setError,
    handleView
  );

  const submitHandler = (values: Args) => {
    setFormStatus("loading");

    void forgotPassword({
      variables: values,
      onError: () => setFormStatus("error"),
      onCompleted,
    });
  };

  const { errors } = formState;
  const ariaId = errors.email ? "email-error-message" : undefined;

  let alertMessage =
    "You are unable to reset your password at the moment. Please try again later";

  if (
    data?.forgotPassword.__typename === "NotAllowedError" ||
    data?.forgotPassword.__typename === "ServerError"
  ) {
    alertMessage = data.forgotPassword.message;
  } else if (error?.graphQLErrors?.[0]) {
    alertMessage = error.graphQLErrors[0].message;
  }

  return (
    <>
      <AlertToast
        horizontal="center"
        vertical="top"
        isOpen={formStatus === "error"}
        onClose={() => setFormStatus("idle")}
        transition={Down}
        severity="error"
        content={alertMessage}
      />
      <form
        onSubmit={handleSubmit(submitHandler)}
        noValidate
        aria-labelledby="page-title"
      >
        <TextField
          type="email"
          id="email"
          autoComplete="email"
          autoFocus
          label="E-Mail"
          margin={errors.email ? "dense" : "normal"}
          error={!!errors.email}
          fullWidth
          {...register("email")}
          helperText={errors.email?.message ?? null}
          FormHelperTextProps={{ id: "email-error-message" }}
          inputProps={{
            "aria-errormessage": ariaId,
            "aria-describedby": ariaId,
          }}
        />
        <LoadingButton
          loading={formStatus === "loading"}
          variant="contained"
          size="large"
          type="submit"
          fullWidth
          sx={{ textTransform: "uppercase", mt: 3 }}
        >
          <span>Send Reset Link</span>
        </LoadingButton>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
