import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import useRegisterUser from "@hooks/registerUser/useRegisterUser";
import AlertToast from "@features/auth/components/AlertToast";
import Down from "@components/SlideTransitions/Down";
import PasswordInput from "@components/ui/PasswordInput";
import { REGISTER_USER } from "@mutations/registerUser/REGISTER_USER";
import { registerUserSchema } from "@validators/registerUserSchema";
import type { RegisterUserInput as Args } from "@apiTypes";

const RegisterUserForm = () => {
  const [registerUser, { error }] = useMutation(REGISTER_USER);

  const { register, handleSubmit, formState, setError } = useForm<Args>({
    resolver: yupResolver(registerUserSchema),
  });

  const { formStatus, setFormStatus, onCompleted } = useRegisterUser(setError);

  const submitHandler = (values: Args) => {
    setFormStatus("loading");

    void registerUser({
      variables: { userInput: values },
      onError: () => setFormStatus("error"),
      onCompleted,
    });
  };

  const { errors } = formState;

  let alertMessage =
    "You are unable to register your account. Please try again later";

  if (error?.graphQLErrors?.[0]) {
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
        <Box sx={{ mb: 3.3 }}>
          <Typography align="center" gutterBottom>
            Account information
          </Typography>
          <Grid container rowSpacing={3} columnSpacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="first-name"
                autoFocus
                autoComplete="given-name"
                label="First Name"
                margin="none"
                error={!!errors.firstName}
                helperText={errors.firstName?.message ?? null}
                fullWidth
                {...register("firstName")}
                FormHelperTextProps={{ id: "first-name-error-message" }}
                inputProps={{
                  "aria-errormessage": errors.firstName
                    ? "first-name-error-message"
                    : undefined,
                  "aria-describedby": errors.firstName
                    ? "first-name-error-message"
                    : undefined,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="last-name"
                autoComplete="family-name"
                label="Last Name"
                margin="none"
                helperText={errors.lastName?.message ?? null}
                error={!!errors.lastName}
                fullWidth
                {...register("lastName")}
                FormHelperTextProps={{ id: "last-name-error-message" }}
                inputProps={{
                  "aria-errormessage": errors.lastName
                    ? "last-name-error-message"
                    : undefined,
                  "aria-describedby": errors.lastName
                    ? "last-name-error-message"
                    : undefined,
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography align="center" gutterBottom>
            Update account password
          </Typography>
          <Grid container rowSpacing={3} columnSpacing={2}>
            <Grid item xs={12} sm={6}>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                label="Password"
                register={register("password")}
                fieldError={errors.password}
                margin="none"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <PasswordInput
                id="confirm-password"
                autoComplete="new-password"
                label="Confirm Password"
                register={register("confirmPassword")}
                fieldError={errors.confirmPassword}
                margin="none"
              />
            </Grid>
          </Grid>
        </Box>
        <LoadingButton
          loading={formStatus === "loading"}
          variant="contained"
          size="large"
          type="submit"
          fullWidth
          sx={{ textTransform: "uppercase" }}
        >
          <span>Register</span>
        </LoadingButton>
      </form>
    </>
  );
};

export default RegisterUserForm;
