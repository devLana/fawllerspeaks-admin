import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";

import useUploadImage from "@hooks/useUploadImage";
import { DRAFT_POST } from "../operations/DRAFT_POST";
import { refetchQueries } from "../utils/refetchQueries";
import type { PostData, StateSetterFn, Status } from "@types";
import type { MutationDraftPostArgs } from "@apiTypes";

export const useDraftPost = (
  postData: PostData,
  setPostData: StateSetterFn<PostData>
) => {
  const [draftStatus, setDraftStatus] = React.useState<Status>("idle");
  const router = useRouter();

  const [draftPost, { client, data, error }] = useMutation(DRAFT_POST);

  const upload = useUploadImage();

  const handleDraftPost = async () => {
    if (!postData.title) {
      setDraftStatus("error");
      return;
    }

    setDraftStatus("loading");

    let uploadHasError = false;
    const post: MutationDraftPostArgs["post"] = {
      title: postData.title,
      ...(postData.description && { description: postData.description }),
      ...(postData.content && { content: postData.content }),
      ...(postData.tags && { tags: postData.tags }),
    };

    if (postData.imageBanner) {
      const imageData = await upload(postData.imageBanner, "post");
      ({ uploadHasError } = imageData);

      if (imageData.imageLink) {
        post.imageBanner = imageData.imageLink;
      }
    }

    void draftPost({
      variables: { post },
      refetchQueries,
      onError: () => setDraftStatus("error"),
      onCompleted(draftData) {
        switch (draftData.draftPost.__typename) {
          case "AuthenticationError":
            void client.clearStore();
            void router.replace("/login?status=unauthenticated");
            break;

          case "RegistrationError":
            void router.replace("/register?status=unregistered");
            break;

          case "NotAllowedError":
            void client.clearStore();
            void router.replace("/login?status=unauthorized");
            break;

          case "PostValidationError":
          case "DuplicatePostTitleError":
          default:
            setDraftStatus("error");
            break;

          case "UnknownError": {
            const { tags: _, ...rest } = postData;
            setDraftStatus("error");
            setPostData(rest);
            break;
          }

          case "SinglePost": {
            const status = uploadHasError ? "?status=draft-upload-error" : "";
            void router.push(`/posts${status}`);
          }
        }
      },
    });
  };

  let msg =
    "You are unable to save this post as draft at the moment. Please try again later";

  if (!postData.title) {
    msg = "No post title provided";
  } else if (error?.graphQLErrors[0]) {
    msg = error.graphQLErrors[0].message;
  } else if (
    data?.draftPost.__typename === "UnknownError" ||
    data?.draftPost.__typename === "DuplicatePostTitleError"
  ) {
    msg = data.draftPost.message;
  } else if (data?.draftPost.__typename === "PostValidationError") {
    if (data.draftPost.titleError) {
      msg = data.draftPost.titleError;
    } else if (data.draftPost.descriptionError) {
      msg = data.draftPost.descriptionError;
    } else if (data.draftPost.contentError) {
      msg = data.draftPost.contentError;
    } else if (data.draftPost.imageBannerError) {
      msg = data.draftPost.imageBannerError;
    } else if (data.draftPost.tagsError) {
      msg = data.draftPost.tagsError;
    }
  }

  return { msg, handleDraftPost, draftStatus, setDraftStatus };
};
