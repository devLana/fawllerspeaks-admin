import * as React from "react";
import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client";
import type { UseFormSetError } from "react-hook-form";

import { SESSION_ID } from "@utils/constants";
import type { OnCompleted } from "@types";
import type { EditPostTagData } from "types/postTags";
import type { PostTagsListAction } from "types/postTags/getPostTags";
import type { MutationEditPostTagArgs } from "@apiTypes";

interface UseEditPostTagProps {
  onStatusChange: (status: "idle") => void;
  dispatch: React.Dispatch<PostTagsListAction>;
  setError: UseFormSetError<Omit<MutationEditPostTagArgs, "tagId">>;
  handleOpenAlert: (message: string) => void;
}

const useEditPostTag = ({
  dispatch,
  handleOpenAlert,
  onStatusChange,
  setError,
}: UseEditPostTagProps) => {
  const [alertIsOpen, setAlertIsOpen] = React.useState(false);
  const router = useRouter();
  const client = useApolloClient();

  const onCompleted: OnCompleted<EditPostTagData> = editData => {
    switch (editData.editPostTag.__typename) {
      case "AuthenticationError":
        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void router.replace(
          `/login?status=unauthenticated&redirectTo=${router.pathname}`
        );
        break;

      case "NotAllowedError":
        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void router.replace("/login?status=unauthorized");
        break;

      case "RegistrationError":
        void router.replace(
          `/register?status=unregistered&redirectTo=${router.pathname}`
        );
        break;

      case "EditPostTagValidationError": {
        const { nameError, tagIdError } = editData.editPostTag;
        const focus = { shouldFocus: true };

        if (tagIdError) setAlertIsOpen(true);

        if (nameError) setError("name", { message: nameError }, focus);

        onStatusChange("idle");
        break;
      }

      case "DuplicatePostTagError": {
        const { message } = editData.editPostTag;

        if (message) setError("name", { message }, { shouldFocus: true });

        onStatusChange("idle");
        break;
      }

      case "UnknownError":
      case "EditedPostTagWarning":
      default:
        onStatusChange("idle");
        setAlertIsOpen(true);
        break;

      case "EditedPostTag": {
        const { __typename, ...rest } = editData.editPostTag.tag;

        handleOpenAlert("Post tag edited");
        onStatusChange("idle");
        dispatch({ type: "POST_TAG_EDITED", payload: rest });
      }
    }
  };

  return { alertIsOpen, setAlertIsOpen, onCompleted };
};

export default useEditPostTag;
