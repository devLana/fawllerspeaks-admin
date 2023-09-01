import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import { yupResolver } from "@hookform/resolvers/yup";

import useGetUserInfo from "@hooks/useGetUserInfo";
import EditProfileForm from "@features/settings/editProfile/components/EditProfileForm";
import EditProfileFileInput, {
  type ImageFile,
} from "@features/settings/editProfile/components/EditProfileFileInput";
import { editProfileValidator } from "@features/settings/editProfile/utils/editProfileValidator";
import { EDIT_PROFILE } from "@features/settings/editProfile/operations/EDIT_PROFILE";
import settingsLayout from "@utils/settings/settingsLayout";
import { SESSION_ID } from "@utils/constants";
import type { NextPageWithLayout } from "@types";
import type { MutationEditProfileArgs } from "@apiTypes";

type EditProfile = Omit<MutationEditProfileArgs, "image">;
type Status = "idle" | "submitting" | "error";

const EditMe: NextPageWithLayout = () => {
  const [status, setStatus] = React.useState<Status>("idle");
  const [removeCurrentImage, setRemoveCurrentImage] = React.useState(false);
  const [image, setImage] = React.useState<ImageFile>({
    error: "",
    file: null,
    fileUrl: "",
  });

  const router = useRouter();

  const [editProfile, { error, client }] = useMutation(EDIT_PROFILE, {
    onError: () => setStatus("error"),
  });

  const user = useGetUserInfo();

  const {
    register,
    handleSubmit,
    formState: { errors, defaultValues },
    setError,
  } = useForm<EditProfile>({
    resolver: yupResolver(editProfileValidator),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    },
  });

  const submitHandler = async (values: EditProfile) => {
    setStatus("submitting");

    let variables: MutationEditProfileArgs = values;
    let uploadHasError = false;

    if (image.file) {
      const body = new FormData();
      body.append("image", image.file);
      body.append("type", "avatar");

      try {
        const request = new Request("/api/upload", { method: "POST", body });
        const response = await fetch(request);
        const imageUrl = await response.text();

        if (!response.ok) {
          uploadHasError = true;
        } else {
          variables = { ...values, image: imageUrl };
        }
      } catch {
        uploadHasError = true;
      }
    } else if (removeCurrentImage) {
      variables = { ...values, image: null };
    }

    const { data } = await editProfile({ variables });

    if (data) {
      switch (data.editProfile.__typename) {
        case "EditProfileValidationError": {
          const focus = { shouldFocus: true };
          const { firstNameError, imageError, lastNameError } =
            data.editProfile;

          if (imageError) setImage({ ...image, error: imageError });

          if (lastNameError) {
            setError("lastName", { message: lastNameError }, focus);
          }

          if (firstNameError) {
            setError("firstName", { message: firstNameError }, focus);
          }

          setStatus("idle");
          break;
        }

        case "AuthenticationError":
          localStorage.removeItem(SESSION_ID);
          void client.clearStore();
          void router.replace("/login?status=unauthenticated");
          break;

        case "UnknownError":
          localStorage.removeItem(SESSION_ID);
          void client.clearStore();
          void router.replace("/login?status=unauthorized");
          break;

        case "RegistrationError":
          void router.replace("/register?status=unregistered");
          break;

        case "EditedProfile": {
          const redirectStatus = uploadHasError ? "upload-error" : "upload";
          void router.push(`/settings/me?status=${redirectStatus}`);
          break;
        }

        default:
          setStatus("error");
          break;
      }
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setImage({ ...image, error: "" });
  };

  let msg =
    "You are unable to update your profile at the moment. Please try again later";

  if (image.error) {
    msg = image.error;
  } else if (error?.graphQLErrors[0]) {
    msg = error.graphQLErrors[0].message;
  }

  return (
    <>
      <EditProfileForm
        onSubmit={handleSubmit(submitHandler)}
        register={register}
        fieldErrors={errors}
        defaultValues={defaultValues}
        isLoading={status === "submitting"}
        fileInput={
          <EditProfileFileInput
            image={image}
            setImage={setImage}
            user={user}
            setRemoveCurrentImage={setRemoveCurrentImage}
            removeCurrentImage={removeCurrentImage}
          />
        }
      />
      {(status === "error" || image.error) && (
        <Snackbar message={msg} open={true} onClose={handleClose} />
      )}
    </>
  );
};

EditMe.layout = settingsLayout("Edit your profile", {
  title: "Edit Admin Profile",
});

export default EditMe;
