import * as React from "react";
import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client";
import type { UseFormSetError } from "react-hook-form";

import useUploadImage from "@hooks/useUploadImage";
import { SESSION_ID } from "@utils/constants";
import type { MutationEditProfileArgs as Args } from "@apiTypes";
import type { Status } from "@types";
import type {
  EditProfileData,
  EditProfileImage,
} from "types/settings/editProfile";

const useEditProfile = (setError: UseFormSetError<Omit<Args, "image">>) => {
  const [formStatus, setFormStatus] = React.useState<Status>("idle");

  const [image, setImage] = React.useState<EditProfileImage>({
    error: "",
    file: null,
    blobUrl: "",
  });

  React.useEffect(() => {
    return () => {
      if (image.blobUrl) {
        window.URL.revokeObjectURL(image.blobUrl);
      }
    };
  }, [image.blobUrl]);

  const { pathname, replace, push } = useRouter();
  const client = useApolloClient();
  const upload = useUploadImage();

  const handleImg = async (removeCurrentImage: boolean) => {
    let imageUrl: Args["image"];
    let uploadHasError = false;

    if (image.file) {
      /*
       * If the user has selected a new image to be uploaded:
       * - attempt to upload the image to storage
       * - if the upload was successful, store the image link url response to a variable
       */
      const data = await upload(image.file, "avatar");
      ({ uploadHasError } = data);

      if (data.imageLink) {
        imageUrl = data.imageLink;
      }
    } else if (removeCurrentImage) {
      /*
       * The user is attempting to remove their current uploaded image:
       * send "image: null" back to the api server
       */
      imageUrl = null;
    }

    return { imageUrl, uploadHasError };
  };

  const onCompleted = (data: EditProfileData, uploadHasError: boolean) => {
    switch (data.editProfile.__typename) {
      case "EditProfileValidationError": {
        const focus = { shouldFocus: true };
        const { firstNameError, imageError, lastNameError } = data.editProfile;

        if (imageError) {
          setImage({ ...image, error: imageError });
        }

        if (lastNameError) {
          setError("lastName", { message: lastNameError }, focus);
        }

        if (firstNameError) {
          setError("firstName", { message: firstNameError }, focus);
        }

        setFormStatus(imageError ? "error" : "idle");
        break;
      }

      case "AuthenticationError": {
        const query = { status: "unauthenticated", redirectTo: pathname };

        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void replace({ pathname: "/login", query });
        break;
      }

      case "UnknownError":
        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void replace({ pathname: "/login", query: { status: "unauthorized" } });
        break;

      case "RegistrationError": {
        const query = { status: "unregistered", redirectTo: pathname };
        void replace({ pathname: "/register", query });
        break;
      }

      case "EditedProfile": {
        const query = { status: uploadHasError ? "upload-error" : "upload" };
        void push({ pathname: "/settings/me", query });
        break;
      }

      default:
        /*
         * The api responds with an unsupported object type:
         * Set error status and reset the image error state
         */
        setFormStatus("error");
        setImage({ ...image, error: "" });
        break;
    }
  };

  return {
    image,
    setImage,
    formStatus,
    setFormStatus,
    onCompleted,
    handleImg,
  };
};

export default useEditProfile;
