import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client";

import { SESSION_ID } from "@utils/constants";
import type { OnCompleted } from "@types";
import type { CreatePostTagsData } from "types/postTags";

const useCreatePostTags = (
  handleDialog: (message: string) => void,
  handleFormAlert: () => void
) => {
  const router = useRouter();
  const client = useApolloClient();

  const onCompleted: OnCompleted<CreatePostTagsData> = data => {
    switch (data.createPostTags.__typename) {
      case "AuthenticationError":
        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void router.replace(
          `/login?status=unauthenticated&redirectTo=${router.pathname}`
        );
        break;

      case "UnknownError":
        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void router.replace("/login?status=unauthorized");
        break;

      case "RegistrationError":
        void router.replace(
          `/register?status=unregistered&redirectTo=${router.pathname}`
        );
        break;

      case "CreatePostTagsValidationError":
      case "DuplicatePostTagError":
      default:
        handleFormAlert();
        break;

      case "CreatedPostTagsWarning":
        handleDialog(data.createPostTags.message);
        break;

      case "PostTags":
        handleDialog("Post tags created");
        break;
    }
  };

  return onCompleted;
};

export default useCreatePostTags;
