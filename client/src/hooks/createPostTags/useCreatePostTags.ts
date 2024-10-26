import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client";

import { usePostTagsPage } from "@context/PostTags";
import { SESSION_ID } from "@utils/constants";
import type { OnCompleted } from "@types";
import type { CreatePostTagsData } from "types/postTags/createPostTags";

const useCreatePostTags = (
  onCloseDialog: () => void,
  handleFormAlert: () => void
) => {
  const { pathname, replace } = useRouter();
  const client = useApolloClient();
  const { handleOpenAlert } = usePostTagsPage();

  const onCompleted: OnCompleted<CreatePostTagsData> = data => {
    switch (data.createPostTags.__typename) {
      case "AuthenticationError": {
        const query = { status: "unauthenticated", redirectTo: pathname };

        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void replace({ pathname: "/login", query });
        break;
      }

      case "UnknownError":
        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void replace({ pathname: "/login", query: { status: "unauthorized" } });
        break;

      case "RegistrationError": {
        const query = { status: "unregistered", redirectTo: pathname };
        void replace({ pathname: "/register", query });
        break;
      }

      case "CreatePostTagsValidationError":
      case "DuplicatePostTagError":
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
