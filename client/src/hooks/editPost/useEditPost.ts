import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";

import useUploadImage from "@hooks/useUploadImage";
import useDeletePostContentImages from "@hooks/useDeletePostContentImages";
import { EDIT_POST } from "@mutations/editPost/EDIT_POST";
import { SESSION_ID } from "@utils/constants";
import * as storage from "@utils/posts/editStoragePost";
import type { EditPostInput, PostStatus } from "@apiTypes";
import type { PostActionStatus } from "types/posts";
import type * as types from "types/posts/editPost";

interface OldPost {
  title: string;
  status: PostStatus;
  slug: string;
}

const useEditPost = (postData: types.EditPostStateData, oldPost: OldPost) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [editStatus, setEditStatus] = React.useState<PostActionStatus>("idle");
  const { push, replace, asPath } = useRouter();

  const [editPost, { client, data, error }] = useMutation(EDIT_POST);

  const upload = useUploadImage();
  const deleteImages = useDeletePostContentImages();

  const handleEditPost = async (previewStatus: PostStatus) => {
    setEditStatus("loading");

    const { imageBanner, editStatus: es, tagIds, ...rest } = postData;
    const status = es ? previewStatus : oldPost.status;
    let uploadHasError = false;

    let post: EditPostInput = {
      ...rest,
      ...(tagIds.length > 0 && { tagIds }),
      ...(es && { editStatus: es }),
    };

    if (status === "Draft") {
      post = {
        id: rest.id,
        title: rest.title,
        ...(rest.description && { description: rest.description }),
        ...(rest.excerpt && { excerpt: rest.excerpt }),
        ...(rest.content && { content: rest.content }),
        ...(tagIds.length > 0 && { tagIds }),
      };
    }

    if (imageBanner.file) {
      const imageData = await upload(imageBanner.file, "postBanner");
      ({ uploadHasError } = imageData);

      if (imageData.imageLink) {
        post.imageBanner = imageData.imageLink;
      }
    } else if (imageBanner.url === null) {
      post.imageBanner === null;
    }

    void editPost({
      variables: { post },
      onError: () => {
        setEditStatus("error");
        setIsOpen(false);
      },
      onCompleted(editData) {
        switch (editData.editPost.__typename) {
          case "AuthenticationError": {
            const q = { status: "unauthenticated", redirectTo: asPath };

            localStorage.removeItem(SESSION_ID);
            void client.clearStore();
            void replace({ pathname: "/login", query: q });
            break;
          }

          case "RegistrationError": {
            const q = { status: "unregistered", redirectTo: asPath };
            void replace({ pathname: "/register", query: q });
            break;
          }

          case "NotAllowedError": {
            const query = { status: "unauthorized" };

            localStorage.removeItem(SESSION_ID);
            void client.clearStore();
            void replace({ pathname: "/login", query });
            break;
          }

          case "EditPostValidationError":
          case "DuplicatePostTitleError":
          case "ForbiddenError":
            setEditStatus("inputError");
            setIsOpen(false);
            break;

          case "UnknownError": {
            const storageData = storage.getEditStoragePost();

            if (storageData?.imgUrls) deleteImages(storageData.imgUrls);

            localStorage.removeItem(storage.EDIT_STORAGE_POST);
            void replace({ pathname: "/posts", query: { message: "unknown" } });
            break;
          }

          case "SinglePost": {
            const { url, title } = editData.editPost.post;
            const query = { edit: uploadHasError };
            const redirect = oldPost.slug !== url.slug ? replace : push;

            client.cache.evict({ id: "ROOT_QUERY", fieldName: "getPosts" });

            if (oldPost.title !== title && oldPost.slug !== url.slug) {
              client.cache.evict({
                id: "ROOT_QUERY",
                fieldName: "getPost",
                args: { slug: oldPost.slug },
              });

              client.cache.evict({
                id: client.cache.identify({
                  __typename: "Post",
                  url: { slug: oldPost.slug },
                }),
                broadcast: false,
              });
            }

            localStorage.removeItem(storage.EDIT_STORAGE_POST);
            void redirect({ pathname: `/posts/view/${url.slug}`, query });
            break;
          }

          default:
            setEditStatus("error");
            setIsOpen(false);
        }
      },
    });
  };

  let errors: types.EditPostFieldErrors = {};
  let msg = `You are unable to edit this post at the moment. Please try again later`;

  if (error?.graphQLErrors?.[0]) {
    msg = error.graphQLErrors[0].message;
  }

  if (data?.editPost.__typename === "EditPostValidationError") {
    const { descriptionError, imageBannerError, ...rest } = data.editPost;

    errors = {
      ...(rest.idError && { idError: rest.idError }),
      ...(rest.titleError && { titleError: rest.titleError }),
      ...(descriptionError && { descriptionError }),
      ...(rest.excerptError && { excerptError: rest.excerptError }),
      ...(rest.contentError && { contentError: rest.contentError }),
      ...(rest.tagIdsError && { tagIdsError: rest.tagIdsError }),
      ...(imageBannerError && { imageBannerError }),
      ...(rest.editStatusError && { editStatusError: rest.editStatusError }),
    };
  } else if (
    data?.editPost.__typename === "ForbiddenError" ||
    data?.editPost.__typename === "DuplicatePostTitleError"
  ) {
    errors = { titleError: data.editPost.message };
  }

  return {
    editStatus,
    errors,
    isOpen,
    msg,
    handleEditPost,
    handleCloseError: () => setEditStatus("idle"),
    setIsOpen,
  };
};

export default useEditPost;
