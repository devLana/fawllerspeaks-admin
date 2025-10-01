import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";

import useUploadImage from "@hooks/useUploadImage";
import { update } from "@cache/update/posts/draftPost";
import { DRAFT_POST } from "@mutations/createPost/DRAFT_POST";
import * as storage from "@utils/posts/createStoragePost";
import { SESSION_ID } from "@utils/constants";
import type { DraftPostInput } from "@apiTypes";
import type * as create from "types/posts/createPost";
import type * as posts from "types/posts";

export const useDraftPost = (
  postData: posts.PostInputData
): create.DraftHookReturnData => {
  const [status, setStatus] = React.useState<posts.PostActionStatus>("idle");
  const { pathname, replace, push } = useRouter();
  const [draftPost, { client, data, error }] = useMutation(DRAFT_POST);
  const upload = useUploadImage();

  const handleDraftPost = async (metadata?: posts.PostMetadataFields) => {
    let post: create.CreatePostRemoveNull<DraftPostInput>;

    setStatus("loading");

    if (metadata) {
      post = {
        title: metadata.title,
        ...(metadata.description && { description: metadata.description }),
        ...(metadata.excerpt && { excerpt: metadata.excerpt }),
        ...(metadata.tagIds.length > 0 && { tagIds: metadata.tagIds }),
        ...(postData.content && { content: postData.content }),
      };
    } else {
      post = {
        title: postData.title,
        ...(postData.description && { description: postData.description }),
        ...(postData.excerpt && { excerpt: postData.excerpt }),
        ...(postData.tagIds.length > 0 && { tagIds: postData.tagIds }),
        ...(postData.content && { content: postData.content }),
      };
    }

    const imageFile = metadata ? metadata.imageBanner : postData.imageBanner;
    let uploadHasError = false;

    if (imageFile) {
      const imageData = await upload(imageFile, "postBanner");
      ({ uploadHasError } = imageData);

      if (imageData.imageLink) {
        post.imageBanner = imageData.imageLink;
      }
    }

    void draftPost({
      variables: { post },
      update,
      onError: () => setStatus("error"),
      onCompleted(draftData) {
        switch (draftData.draftPost.__typename) {
          case "AuthenticationError": {
            const query = { status: "unauthenticated", redirectTo: pathname };

            storage.saveCreateStoragePost(post);
            localStorage.removeItem(SESSION_ID);
            void client.clearStore();
            void replace({ pathname: "/login", query });
            break;
          }

          case "RegistrationError": {
            const query = { status: "unregistered", redirectTo: pathname };

            storage.saveCreateStoragePost(post);
            void replace({ pathname: "/register", query });
            break;
          }

          case "NotAllowedError": {
            const query = { status: "unauthorized" };

            storage.saveCreateStoragePost(post);
            localStorage.removeItem(SESSION_ID);
            void client.clearStore();
            void replace({ pathname: "/login", query });
            break;
          }

          case "PostValidationError":
          case "DuplicatePostTitleError":
          case "ForbiddenError": {
            setStatus("inputError");
            break;
          }

          case "SinglePost": {
            const { slug } = draftData.draftPost.post.url;
            const query = { draft: uploadHasError };

            localStorage.removeItem(storage.CREATE_STORAGE_POST);
            void push({ pathname: `/posts/view/${slug}`, query });
            break;
          }

          default:
            setStatus("error");
        }
      },
    });
  };

  const handleHideErrors = () => setStatus("idle");
  let errors: create.CreatePostFieldErrors = {};
  let msg = `You are unable to save this post as draft at the moment. Please try again later`;

  if (data?.draftPost.__typename === "PostValidationError") {
    const errs = data.draftPost;

    errors = {
      ...(errs.titleError && { titleError: errs.titleError }),
      ...(errs.descriptionError && { descriptionError: errs.descriptionError }),
      ...(errs.excerptError && { excerptError: errs.excerptError }),
      ...(errs.contentError && { contentError: errs.contentError }),
      ...(errs.tagIdsError && { tagIdsError: errs.tagIdsError }),
      ...(errs.imageBannerError && { imageBannerError: errs.imageBannerError }),
    };
  } else if (
    data?.draftPost.__typename === "ForbiddenError" ||
    data?.draftPost.__typename === "DuplicatePostTitleError"
  ) {
    errors = { titleError: data.draftPost.message };
  } else if (error?.graphQLErrors?.[0]) {
    msg = error.graphQLErrors[0].message;
  }

  return { msg, status, errors, handleDraftPost, handleHideErrors };
};
