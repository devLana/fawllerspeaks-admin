import * as React from "react";
import { useRouter } from "next/router";

import { useApolloClient, type useMutation } from "@apollo/client/react";

import { usePostTagsPage } from "@providers/PostTags";
import type { OnCompleted } from "@appTypes";
import type { DeletePostTagsData } from "@appTypes/postTags/deletePostTags";

const useDeletePostTags = (
  handleRemoveTags: () => void,
  handleClose: () => void,
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
      case "UnauthorizedError": {
        const query = { status: "unauthorized", redirectTo: pathname };

        void client.clearStore();
        void replace({ pathname: "/login", query });
        break;
      }

      case "RegistrationError": {
        const query = { status: "unregistered", redirectTo: pathname };
        void replace({ pathname: "/register", query });
        break;
      }

      case "DeletePostTagsValidationError":
        handleResponse(data.deletePostTags.tagIdsError);
        break;

      case "NotFoundError":
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

  const onError: useMutation.Options["onError"] = err => {
    handleError(err.graphQLErrors?.[0]?.message ?? msg);
  };

  return { onCompleted, onError, isLoading, setIsLoading };
};

export default useDeletePostTags;
