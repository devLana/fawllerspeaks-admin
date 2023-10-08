import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import { yupResolver } from "@hookform/resolvers/yup";

import useUploadImage from "@hooks/useUploadImage";
import useGetUserInfo from "@hooks/useGetUserInfo";
import EditProfileForm from "@features/settings/editProfile/components/EditProfileForm";
import EditProfileFileInput, {
  type ImageFile,
} from "@features/settings/editProfile/components/EditProfileFileInput";
import { editProfileValidator } from "@features/settings/editProfile/utils/editProfileValidator";
import { EDIT_PROFILE } from "@features/settings/editProfile/operations/EDIT_PROFILE";
import settingsLayout from "@utils/settings/settingsLayout";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { NextPageWithLayout } from "@types";
import type { MutationEditProfileArgs } from "@apiTypes";

type EditProfile = Omit<MutationEditProfileArgs, "image">;

const EditMe: NextPageWithLayout = () => {
  const [status, setStatus] = React.useState<"idle" | "submitting">("idle");
  const [removeCurrentImage, setRemoveCurrentImage] = React.useState(false);
  const [image, setImage] = React.useState<ImageFile>({
    error: "",
    file: null,
    fileUrl: "",
  });
  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();

  const [editProfile, { error, client }] = useMutation(EDIT_PROFILE);

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

  const upload = useUploadImage();

  const submitHandler = async (values: EditProfile) => {
    setStatus("submitting");

    let variables: MutationEditProfileArgs = values;
    let uploadHasError = false;

    if (image.file) {
      const data = await upload(image.file, "avatar");
      ({ uploadHasError } = data);

      if (data.imageLink) {
        variables = { ...values, image: data.imageLink };
      }
    } else if (removeCurrentImage) {
      variables = { ...values, image: null };
    }

    const { data } = await editProfile({
      variables,
      onError() {
        setStatus("idle");
        setIsOpen(true);
        setImage({ ...image, error: "" });
      },
    });

    if (data) {
      switch (data.editProfile.__typename) {
        case "EditProfileValidationError": {
          const focus = { shouldFocus: true };
          const { firstNameError, imageError, lastNameError } =
            data.editProfile;

          if (imageError) {
            setImage({ ...image, error: imageError });
            setIsOpen(true);
          }

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
          void client.clearStore();
          void router.replace("/login?status=unauthenticated");
          break;

        case "UnknownError":
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
          setStatus("idle");
          setIsOpen(true);
          setImage({ ...image, error: "" });
          break;
      }
    }
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
            setIsOpen={setIsOpen}
          />
        }
      />
      <Snackbar
        message={msg}
        open={isOpen}
        onClose={handleCloseAlert<boolean>(false, setIsOpen)}
      />
    </>
  );
};

EditMe.layout = settingsLayout("Edit your profile", {
  title: "Edit Admin Profile",
});

export default EditMe;
