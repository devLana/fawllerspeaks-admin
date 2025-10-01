import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";

import useUploadImage from "@hooks/useUploadImage";
import { update } from "@cache/update/posts/createPost";
import { CREATE_POST } from "@mutations/createPost/CREATE_POST";
import { SESSION_ID } from "@utils/constants";
import { CREATE_STORAGE_POST } from "@utils/posts/createStoragePost";
import type { CreatePostInput } from "@apiTypes";
import type { PostActionStatus, PostInputData as Data } from "types/posts";
import type * as types from "types/posts/createPost";

export const useCreatePost = (postData: Data): types.CreateHookReturnData => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [status, setStatus] = React.useState<PostActionStatus>("idle");
  const { push, replace, pathname } = useRouter();

  const [createPost, { client, data, error }] = useMutation(CREATE_POST);

  const upload = useUploadImage();

  const handleCreatePost = async () => {
    setStatus("loading");

    const { imageBanner, tagIds, ...rest } = postData;
    let uploadHasError = false;

    const post: CreatePostInput = {
      ...rest,
      ...(tagIds.length > 0 && { tagIds }),
    };

    if (imageBanner) {
      const imageData = await upload(imageBanner, "postBanner");
      ({ uploadHasError } = imageData);

      if (imageData.imageLink) {
        post.imageBanner = imageData.imageLink;
      }
    }

    void createPost({
      variables: { post },
      update,
      onError: () => {
        setStatus("error");
        setIsOpen(false);
      },
      onCompleted(createData) {
        switch (createData.createPost.__typename) {
          case "AuthenticationError": {
            const query = { status: "unauthenticated", redirectTo: pathname };

            localStorage.removeItem(SESSION_ID);
            void client.clearStore();
            void replace({ pathname: "/login", query });
            break;
          }

          case "RegistrationError": {
            const query = { status: "unregistered", redirectTo: pathname };
            void replace({ pathname: "/register", query });
            break;
          }

          case "NotAllowedError": {
            const query = { status: "unauthorized" };

            localStorage.removeItem(SESSION_ID);
            void client.clearStore();
            void replace({ pathname: "/login", query });
            break;
          }

          case "PostValidationError":
          case "DuplicatePostTitleError":
          case "ForbiddenError":
            setStatus("inputError");
            setIsOpen(false);
            break;

          case "SinglePost": {
            const { slug } = createData.createPost.post.url;
            const query = { create: uploadHasError };

            localStorage.removeItem(CREATE_STORAGE_POST);
            void push({ pathname: `/posts/view/${slug}`, query });
            break;
          }

          default:
            setStatus("error");
            setIsOpen(false);
        }
      },
    });
  };

  let errors: types.CreatePostFieldErrors = {};
  let msg = `You are unable to create and publish this post at the moment. Please try again later`;

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
    errors = { titleError: data.createPost.message };
  }

  return {
    msg,
    isOpen,
    status,
    errors,
    handleCreatePost,
    handleHideErrors: () => setStatus("idle"),
    setIsOpen,
  };
};
