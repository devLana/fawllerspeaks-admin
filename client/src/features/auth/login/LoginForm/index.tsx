import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

import useLogin from "@hooks/login/useLogin";
import AlertToast from "@features/auth/components/AlertToast";
import Down from "@components/SlideTransitions/Down";
import PasswordInput from "@components/ui/PasswordInput";
import { LOGIN_USER } from "@mutations/login/LOGIN_USER";
import { loginSchema } from "@validators/loginSchema";
import type { MutationLoginArgs as Args } from "@apiTypes";

const LoginForm = () => {
  const [login, { data, error }] = useMutation(LOGIN_USER);

  const { register, handleSubmit, formState, setError } = useForm<Args>({
    resolver: yupResolver(loginSchema),
  });

  const { formStatus, onCompleted, setFormStatus } = useLogin(setError);

  const submitHandler = (values: Args) => {
    setFormStatus("loading");

    void login({
      variables: values,
      onError: () => setFormStatus("error"),
      onCompleted,
    });
  };

  const { errors } = formState;
  const ariaId = errors.email ? "email-error-message" : undefined;

  let alertMessage =
    "You are unable to login at the moment. Please try again later";

  if (data?.login.__typename === "NotAllowedError") {
    alertMessage = data.login.message;
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
          id="email"
          type="email"
          autoComplete="email"
          autoFocus
          label="E-Mail"
          margin={errors.email ? "dense" : "normal"}
          error={!!errors.email}
          fullWidth
          helperText={errors.email?.message ?? null}
          {...register("email")}
          FormHelperTextProps={{ id: "email-error-message" }}
          inputProps={{
            "aria-errormessage": ariaId,
            "aria-describedby": ariaId,
          }}
        />
        <PasswordInput
          id="password"
          autoComplete="current-password"
          label="Password"
          register={register("password")}
          fieldError={errors.password}
          margin={errors.password ? "dense" : "normal"}
        />
        <LoadingButton
          loading={formStatus === "loading"}
          variant="contained"
          size="large"
          type="submit"
          fullWidth
          sx={{ textTransform: "uppercase", mt: 3 }}
        >
          <span>Login</span>
        </LoadingButton>
      </form>
    </>
  );
};

export default LoginForm;
