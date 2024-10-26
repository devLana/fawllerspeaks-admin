import * as React from "react";
import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client";

import { usePostTagsPage } from "@context/PostTags";
import { SESSION_ID } from "@utils/constants";
import type { OnCompleted, OnError } from "@types";
import type { DeletePostTagsData } from "types/postTags/deletePostTags";

const useDeletePostTags = (
  handleRemoveTags: () => void,
  handleClose: () => void
) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { replace, pathname } = useRouter();

  const client = useApolloClient();
  const { handleOpenAlert } = usePostTagsPage();

  const msg =
    "You are unable to delete post tags at the moment. Please try again later";

  function handleError(message: string) {
    handleClose();
    handleOpenAlert(message);
    setIsLoading(false);
  }

  const handleResponse = (message: string) => {
    handleRemoveTags();
    handleOpenAlert(message);
    setIsLoading(false);
  };

  const onCompleted: OnCompleted<DeletePostTagsData> = data => {
    switch (data.deletePostTags.__typename) {
      case "AuthenticationError": {
        const query = { status: "unauthenticated", redirectTo: pathname };

        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void replace({ pathname: "/login", query });
        break;
      }

      case "NotAllowedError":
        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void replace({ pathname: "/login", query: { status: "unauthorized" } });
        break;

      case "RegistrationError": {
        const query = { status: "unregistered", redirectTo: pathname };
        void replace({ pathname: "/register", query });
        break;
      }

      case "DeletePostTagsValidationError":
        handleResponse(data.deletePostTags.tagIdsError);
        break;

      case "UnknownError":
      case "DeletedPostTagsWarning":
        handleResponse(data.deletePostTags.message);
        break;

      case "DeletedPostTags": {
        const { tagIds } = data.deletePostTags;

        handleResponse(`Post ${tagIds.length > 1 ? "tags" : "tag"} deleted`);
        break;
      }

      default:
        handleError(msg);
    }
  };

  const onError: OnError = err => {
    handleError(err.graphQLErrors?.[0]?.message ?? msg);
  };

  return { onCompleted, onError, isLoading, setIsLoading };
};

export default useDeletePostTags;
