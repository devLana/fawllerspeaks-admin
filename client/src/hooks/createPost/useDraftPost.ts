import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";

import useUploadImage from "@hooks/useUploadImage";
import { DRAFT_POST } from "@mutations/createPost/DRAFT_POST";
import { SESSION_ID } from "@utils/constants";
import type {
  CreateInputErrors,
  CreatePostData,
  CreateStatus,
  DraftErrorCb,
} from "../../types/posts/createPost";
import type { DraftPostInput } from "@apiTypes";

export const useDraftPost = (postData: CreatePostData) => {
  const [draftStatus, setDraftStatus] = React.useState<CreateStatus>("idle");
  const { pathname, replace, push } = useRouter();

  const [draftPost, { client, data, error }] = useMutation(DRAFT_POST);

  const upload = useUploadImage();

  const handleDraftPost = async (errorCb?: DraftErrorCb) => {
    setDraftStatus("loading");

    let uploadHasError = false;

    const post: DraftPostInput = {
      title: postData.title,
      ...(postData.description && { description: postData.description }),
      ...(postData.excerpt && { excerpt: postData.excerpt }),
      ...(postData.content && { content: postData.content }),
      ...(postData.tagIds && { tagIds: postData.tagIds }),
    };

    if (postData.imageBanner) {
      const imageData = await upload(postData.imageBanner.file, "postBanner");
      ({ uploadHasError } = imageData);

      if (imageData.imageLink) {
        post.imageBanner = imageData.imageLink;
      }
    }

    void draftPost({
      variables: { post },
      onError: () => setDraftStatus("error"),
      onCompleted(draftData) {
        switch (draftData.draftPost.__typename) {
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

          case "PostValidationError": {
            const { titleError, descriptionError, excerptError } =
              draftData.draftPost;

            errorCb?.({ titleError, descriptionError, excerptError });
            setDraftStatus("inputError");
            break;
          }

          case "DuplicatePostTitleError":
          case "ForbiddenError": {
            const { message } = draftData.draftPost;
            errorCb?.({ titleError: message });
            setDraftStatus("inputError");
            break;
          }

          case "SinglePost": {
            const { slug } = draftData.draftPost.post.url;
            const query = { slug, draft: uploadHasError };

            void push({ pathname: "/posts/view/[slug]", query });
            break;
          }

          default:
            setDraftStatus("error");
        }
      },
    });
  };

  let errors: CreateInputErrors = {};

  let msg =
    "You are unable to save this post as draft at the moment. Please try again later";

  if (error?.graphQLErrors?.[0]) {
    msg = error.graphQLErrors[0].message;
  }

  if (data?.draftPost.__typename === "PostValidationError") {
    const { descriptionError, imageBannerError, ...rest } = data.draftPost;

    errors = {
      ...(rest.titleError && { titleError: rest.titleError }),
      ...(descriptionError && { descriptionError }),
      ...(rest.excerptError && { excerptError: rest.excerptError }),
      ...(rest.contentError && { contentError: rest.contentError }),
      ...(rest.tagIdsError && { tagIdsError: rest.tagIdsError }),
      ...(imageBannerError && { imageBannerError }),
    };
  } else if (
    data?.draftPost.__typename === "ForbiddenError" ||
    data?.draftPost.__typename === "DuplicatePostTitleError"
  ) {
    errors.titleError = data.draftPost.message;
  }

  const handleCloseError = () => setDraftStatus("idle");

  return { msg, draftStatus, errors, handleDraftPost, handleCloseError };
};
