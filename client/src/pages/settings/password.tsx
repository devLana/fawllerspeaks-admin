import * as React from "react";
import { useRouter } from "next/router";

import { useMutation, gql } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Snackbar from "@mui/material/Snackbar";

import { useSession } from "@context/SessionContext";
import ChangePasswordForm from "@features/settings/changePassword/components/ChangePasswordForm";
import { changePasswordValidator } from "@features/settings/changePassword/utils/changePasswordValidator";
import { CHANGE_PASSWORD } from "@features/settings/changePassword/operations/CHANGE_PASSWORD";
import settingsLayout from "@utils/settings/settingsLayout";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import { type NextPageWithLayout } from "@types";
import { type MutationChangePasswordArgs } from "@apiTypes";

type Status = "idle" | "submitting" | "error" | "success";

const ChangePassword: NextPageWithLayout = () => {
  const [formStatus, setFormStatus] = React.useState<Status>("idle");

  const { replace } = useRouter();

  const [password, { data, error, client }] = useMutation(CHANGE_PASSWORD);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<MutationChangePasswordArgs>({
    resolver: yupResolver(changePasswordValidator),
  });

  const { userId } = useSession();
  const user = client.readFragment<{ email: string }>({
    id: userId ?? "",
    fragment: gql`
      fragment GetChangePasswordUser on User {
        email
      }
    `,
  });

  const submitHandler = async (values: MutationChangePasswordArgs) => {
    setFormStatus("submitting");

    const { data: response } = await password({
      variables: values,
      onError: () => setFormStatus("error"),
    });

    if (response) {
      switch (response.changePassword.__typename) {
        case "ChangePasswordValidationError": {
          const fieldErrors = response.changePassword;
          const focus = { shouldFocus: true };

          if (fieldErrors.confirmNewPasswordError) {
            const message = fieldErrors.confirmNewPasswordError;
            setError("confirmNewPassword", { message }, focus);
          }

          if (fieldErrors.newPasswordError) {
            const message = fieldErrors.newPasswordError;
            setError("newPassword", { message }, focus);
          }

          if (fieldErrors.currentPasswordError) {
            const message = fieldErrors.currentPasswordError;
            setError("currentPassword", { message }, focus);
          }

          setFormStatus("idle");
          break;
        }

        case "AuthenticationError":
          void client.clearStore();
          void replace("/login?status=unauthenticated");
          break;

        case "UnknownError":
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
          reset();
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
    <>
      <Snackbar
        message={msg}
        open={formStatus === "error" || formStatus === "success"}
        onClose={handleCloseAlert<Status>("idle", setFormStatus)}
      />
      <ChangePasswordForm
        email={user?.email ?? ""}
        isLoading={formStatus === "submitting"}
        fieldErrors={errors}
        onSubmit={handleSubmit(submitHandler)}
        register={register}
      />
    </>
  );
};

ChangePassword.layout = settingsLayout("Change your password", {
  title: "Change Password",
});

export default ChangePassword;
