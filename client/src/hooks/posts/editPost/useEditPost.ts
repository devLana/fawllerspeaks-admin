import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client/react";

import useUploadImage from "@hooks/common/useUploadImage";
import useDeletePostContentImages from "@hooks/posts/useDeletePostContentImages";
import { update } from "@cache/update/posts/editPost";
import { EDIT_POST } from "@mutations/posts/EDIT_POST";

import * as storage from "@utils/posts/editStoragePost";
import type { PostActionStatus } from "@appTypes/posts";
import type * as types from "@appTypes/posts/editPost";
import type { EditPostInput, PostStatus } from "@appTypes/graphql";

interface OldPost {
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
      update: update(oldPost.slug, oldPost.status),
      onError: () => {
        setEditStatus("error");
        setIsOpen(false);
      },
      onCompleted(editData) {
        switch (editData.editPost.__typename) {
          case "UnauthorizedError": {
            const q = { status: "unauthorized", redirectTo: asPath };

            void client.clearStore();
            void replace({ pathname: "/login", query: q });
            break;
          }

          case "RegistrationError": {
            const q = { status: "unregistered", redirectTo: asPath };
            void replace({ pathname: "/register", query: q });
            break;
          }

          case "EditPostValidationError":
          case "ForbiddenError":
            setEditStatus("inputError");
            setIsOpen(false);
            break;

          case "NotFoundError": {
            const storageData = storage.getEditStoragePost();

            if (storageData?.imgUrls) deleteImages(storageData.imgUrls);

            localStorage.removeItem(storage.EDIT_STORAGE_POST);
            void replace({ pathname: "/posts", query: { message: "unknown" } });
            break;
          }

          case "SinglePost": {
            const { url } = editData.editPost.post;
            const query = { edit: uploadHasError };
            const pathname = `/posts/view/${url.slug}`;
            const redirect = oldPost.slug !== url.slug ? replace : push;

            localStorage.removeItem(storage.EDIT_STORAGE_POST);

            void redirect({ pathname, query }).then(() => {
              if (url.slug !== oldPost.slug) {
                client.cache.evict({
                  fieldName: "getPost",
                  args: { slug: oldPost.slug },
                });

                client.cache.evict({
                  id: client.cache.identify({
                    __typename: "Post",
                    url: { slug: oldPost.slug },
                  }),
                });
              }
            });
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
  } else if (data?.editPost.__typename === "ForbiddenError") {
    errors = { titleError: data.editPost.message };
  }

  return {
    editStatus,
    errors,
    isOpen,
    msg,
    handleEditPost,
    handleCloseError: () => {
      setEditStatus("idle");
    },
    setIsOpen,
  };
};

export default useEditPost;
