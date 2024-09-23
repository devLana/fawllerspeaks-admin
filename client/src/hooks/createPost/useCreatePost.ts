import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";

import useUploadImage from "@hooks/useUploadImage";
import { CREATE_POST } from "@mutations/createPost/CREATE_POST";
import { SESSION_ID } from "@utils/constants";
import type { CreatePostInput } from "@apiTypes";
import type {
  CreateInputErrors,
  CreatePostData,
  CreateStatus,
} from "types/posts/createPost";

export const useCreatePost = (
  post: CreatePostData,
  handleCloseDialog: VoidFunction
) => {
  const [createStatus, setCreateStatus] = React.useState<CreateStatus>("idle");
  const { push, replace, pathname } = useRouter();

  const [createPost, { client, data, error }] = useMutation(CREATE_POST);

  const upload = useUploadImage();

  const handleCreatePost = async () => {
    setCreateStatus("loading");

    const { imageBanner, tagIds, ...rest } = post;
    const postInput: CreatePostInput = { ...rest, tagIds: tagIds || null };
    let uploadHasError = false;

    if (imageBanner) {
      const imageData = await upload(imageBanner.file, "postBanner");
      ({ uploadHasError } = imageData);

      if (imageData.imageLink) {
        postInput.imageBanner = imageData.imageLink;
      }
    }

    void createPost({
      variables: { post: postInput },
      onError: () => {
        setCreateStatus("error");
        handleCloseDialog();
      },
      onCompleted(createData) {
        switch (createData.createPost.__typename) {
          case "AuthenticationError":
            localStorage.removeItem(SESSION_ID);
            void client.clearStore();
            void replace(
              `/login?status=unauthenticated&redirectTo=${pathname}`
            );
            break;

          case "RegistrationError":
            void replace(
              `/register?status=unregistered&redirectTo=${pathname}`
            );
            break;

          case "NotAllowedError":
            localStorage.removeItem(SESSION_ID);
            void client.clearStore();
            void replace("/login?status=unauthorized");
            break;

          case "PostValidationError":
          case "DuplicatePostTitleError":
          case "ForbiddenError":
            setCreateStatus("inputError");
            handleCloseDialog();
            break;

          case "SinglePost": {
            const status = uploadHasError ? "?image=create-upload-error" : "";
            void push(`/posts${status}`);
            break;
          }

          default:
            setCreateStatus("error");
            handleCloseDialog();
        }
      },
    });
  };

  let errors: CreateInputErrors = {};

  let msg =
    "You are unable to create and publish this post at the moment. Please try again later";

  if (error?.graphQLErrors?.[0]) {
    msg = error.graphQLErrors[0].message;
  }

  if (data?.createPost.__typename === "PostValidationError") {
    const { descriptionError, imageBannerError, ...rest } = data.createPost;

    errors = {
      ...(rest.titleError && { titleError: rest.titleError }),
      ...(descriptionError && { descriptionError }),
      ...(rest.excerptError && { excerptError: rest.excerptError }),
      ...(rest.contentError && { contentError: rest.contentError }),
      ...(rest.tagIdsError && { tagIdsError: rest.tagIdsError }),
      ...(imageBannerError && { imageBannerError }),
    };
  } else if (
    data?.createPost.__typename === "ForbiddenError" ||
    data?.createPost.__typename === "DuplicatePostTitleError"
  ) {
    errors.titleError = data.createPost.message;
  }

  const handleCloseError = () => setCreateStatus("idle");

  return { createStatus, msg, errors, handleCreatePost, handleCloseError };
};
