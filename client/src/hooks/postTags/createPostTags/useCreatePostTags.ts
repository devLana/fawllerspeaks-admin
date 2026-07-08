import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client/react";

import { usePostTagsPage } from "@providers/PostTags";

import type { OnCompleted } from "@appTypes";
import type { CreatePostTagsData } from "@appTypes/postTags/createPostTags";

const useCreatePostTags = (
  onCloseDialog: () => void,
  handleFormAlert: () => void,
) => {
  const { pathname, replace } = useRouter();
  const client = useApolloClient();
  const { handleOpenAlert } = usePostTagsPage();

  const onCompleted: OnCompleted<CreatePostTagsData> = data => {
    switch (data.createPostTags.__typename) {
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

      case "CreatePostTagsValidationError":
      case "ForbiddenError":
      default:
        handleFormAlert();
        break;

      case "CreatedPostTagsWarning":
        handleOpenAlert(data.createPostTags.message);
        onCloseDialog();
        break;

      case "PostTags":
        handleOpenAlert("Post tags created");
        onCloseDialog();
        break;
    }
  };

  return onCompleted;
};

export default useCreatePostTags;
