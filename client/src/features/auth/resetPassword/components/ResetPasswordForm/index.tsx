import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import useResetPassword from "@hooks/resetPassword/useResetPassword";
import PasswordInput from "@components/ui/PasswordInput";
import { resetPasswordSchema } from "@validators/resetPasswordSchema";
import { RESET_PASSWORD } from "@mutations/resetPassword/RESET_PASSWORD";
import type { MutationResetPasswordArgs } from "@apiTypes";
import type { ResetPasswordFormProps as Props } from "types/auth/resetPassword";

type OmitToken = Omit<MutationResetPasswordArgs, "token">;

const ResetPasswordForm = ({ email, resetToken, handleView }: Props) => {
  const { push } = useRouter();

  const [resetPassword] = useMutation(RESET_PASSWORD);

  const { register, handleSubmit, formState, setError } = useForm<OmitToken>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const { formStatus, setFormStatus, onCompleted } = useResetPassword(
    setError,
    handleView
  );

  const submitHandler = (values: OmitToken) => {
    setFormStatus("loading");

    void resetPassword({
      variables: { ...values, token: resetToken },
      onError(err) {
        const status = err.graphQLErrors?.length > 0 ? "api" : "network";
        void push({ pathname: "/forgot-password", query: { status } });
      },
      onCompleted,
    });
  };

  const { errors } = formState;

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      noValidate
      aria-labelledby="page-title"
    >
      <TextField
        id="email"
        autoComplete="email"
        label="E-Mail"
        fullWidth
        value={email}
        inputProps={{ readOnly: true }}
      />
      <Typography align="center" mt={3} mb={1}>
        Enter your new password below
      </Typography>
      <PasswordInput
        id="password"
        autoComplete="new-password"
        autoFocus
        label="Password"
        register={register("password")}
        fieldError={errors.password}
        margin={errors.password ? "dense" : "normal"}
      />
      <PasswordInput
        id="confirm-password"
        autoComplete="new-password"
        label="Confirm Password"
        register={register("confirmPassword")}
        fieldError={errors.confirmPassword}
        margin={errors.confirmPassword ? "dense" : "normal"}
      />
      <LoadingButton
        loading={formStatus === "loading"}
        variant="contained"
        size="large"
        type="submit"
        fullWidth
        sx={{ textTransform: "uppercase", mt: 3 }}
      >
        <span>Reset Password</span>
      </LoadingButton>
    </form>
  );
};

export default ResetPasswordForm;
