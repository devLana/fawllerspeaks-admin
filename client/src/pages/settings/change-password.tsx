import * as React from "react";
import { useRouter } from "next/router";

import { useApolloClient, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";

import PasswordInput from "@components/PasswordInput";
import { changePasswordValidator } from "@features/settings/changePassword/utils/changePasswordValidator";
import { CHANGE_PASSWORD } from "@features/settings/changePassword/operations/CHANGE_PASSWORD";
import { SESSION_ID } from "@utils/constants";
import settingsLayout from "@utils/settingsLayout.tsx";
import { type NextPageWithLayout } from "@types";
import { type MutationChangePasswordArgs } from "@apiTypes";

type Status = "idle" | "submitting" | "error" | "success";

const ChangePassword: NextPageWithLayout = () => {
  const [formStatus, setFormStatus] = React.useState<Status>("idle");

  const { replace } = useRouter();

  const client = useApolloClient();
  const [changePassword, { data, error }] = useMutation(CHANGE_PASSWORD, {
    onError: () => setFormStatus("error"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<MutationChangePasswordArgs>({
    resolver: yupResolver(changePasswordValidator),
  });

  const submitHandler = async (values: MutationChangePasswordArgs) => {
    setFormStatus("submitting");

    const { data: response } = await changePassword({ variables: values });

    if (response) {
      switch (response.changePassword.__typename) {
        case "ChangePasswordValidationError": {
          const fieldErrors = response.changePassword;
          const focus = { shouldFocus: true };

          if (fieldErrors.currentPasswordError) {
            const message = fieldErrors.currentPasswordError;
            setError("currentPassword", { message }, focus);
          }

          if (fieldErrors.newPasswordError) {
            const message = fieldErrors.newPasswordError;
            setError("newPassword", { message }, focus);
          }

          if (fieldErrors.confirmNewPasswordError) {
            const message = fieldErrors.confirmNewPasswordError;
            setError("newPassword", { message }, focus);
          }

          setFormStatus("idle");

          break;
        }

        case "AuthenticationError":
          localStorage.removeItem(SESSION_ID);
          void client.clearStore();
          void replace("/login?status=unauthenticated");
          break;

        case "UnknownError":
          localStorage.removeItem(SESSION_ID);
          void client.clearStore();
          void replace("/login?status=unauthorized");
          break;

        case "RegistrationError":
          void replace("/register?status=unregistered");
          break;

        case "NotAllowedError":
        case "ServerError":
        default:
          setFormStatus("error");
          break;

        case "Response":
          setFormStatus("success");
      }
    }
  };

  let msg =
    "You are unable to change your password at the moment. Please try again later";

  if (data?.changePassword.__typename === "NotAllowedError") {
    msg =
      "Unable to change password. 'current password' does not match your account";
  } else if (
    data?.changePassword.__typename === "Response" ||
    data?.changePassword.__typename === "ServerError"
  ) {
    msg = data.changePassword.message;
  } else if (error?.graphQLErrors[0]) {
    msg = error.graphQLErrors[0].message;
  }

  return (
    <div>
      {(formStatus === "error" || formStatus === "success") && (
        <Alert severity={formStatus}>{msg}</Alert>
      )}
      <form onSubmit={handleSubmit(submitHandler)} noValidate>
        <PasswordInput
          id="current-password"
          autoComplete="current-password"
          autoFocus
          label="Current Password"
          register={register("currentPassword")}
          fieldError={errors.currentPassword}
          margin={errors.currentPassword ? "dense" : "normal"}
        />
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          autoFocus
          label="New Password"
          register={register("newPassword")}
          fieldError={errors.newPassword}
          margin={errors.newPassword ? "dense" : "normal"}
        />
        <PasswordInput
          id="confirm-new-password"
          autoComplete="new-password"
          autoFocus
          label="Confirm New Password"
          register={register("confirmNewPassword")}
          fieldError={errors.confirmNewPassword}
          margin={errors.confirmNewPassword ? "dense" : "normal"}
        />
        <LoadingButton
          loading={formStatus === "submitting"}
          variant="contained"
          size="large"
          type="submit"
          fullWidth
          sx={{ textTransform: "uppercase", mt: 3 }}
        >
          <span>Change Password</span>
        </LoadingButton>
      </form>
    </div>
  );
};

ChangePassword.layout = settingsLayout("Change your password", {
  title: "Change Password",
});

export default ChangePassword;
