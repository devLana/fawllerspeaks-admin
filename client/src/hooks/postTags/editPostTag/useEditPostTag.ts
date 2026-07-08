import * as React from "react";
import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client/react";
import type { UseFormSetError } from "react-hook-form";

import { usePostTagsPage } from "@providers/PostTags";

import type { OnCompleted } from "@appTypes";
import type { EditPostTagData } from "@appTypes/postTags/editPostTag";
import type { MutationEditPostTagArgs } from "@appTypes/graphql";

interface UseEditPostTagOptions {
  onUnknownTag: () => void;
  onStatusChange: (status: "idle") => void;
  onEdit: ({ id, name }: { id: string; name: string }) => void;
  setError: UseFormSetError<Omit<MutationEditPostTagArgs, "tagId">>;
}

const useEditPostTag = (options: UseEditPostTagOptions) => {
  const { onEdit, onUnknownTag, onStatusChange, setError } = options;

  const [alertIsOpen, setAlertIsOpen] = React.useState(false);
  const { pathname, replace } = useRouter();

  const client = useApolloClient();

  const { handleOpenAlert } = usePostTagsPage();

  const onCompleted: OnCompleted<EditPostTagData> = editData => {
    switch (editData.editPostTag.__typename) {
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

      case "EditPostTagValidationError": {
        const { nameError, tagIdError } = editData.editPostTag;
        const focus = { shouldFocus: true };

        if (tagIdError) setAlertIsOpen(true);
        if (nameError) setError("name", { message: nameError }, focus);

        onStatusChange("idle");
        break;
      }

      case "ForbiddenError": {
        const { message } = editData.editPostTag;

        if (message) setError("name", { message }, { shouldFocus: true });

        onStatusChange("idle");
        break;
      }

      case "NotFoundError": {
        const { message } = editData.editPostTag;

        onStatusChange("idle");
        handleOpenAlert(message);
        onUnknownTag();
        break;
      }

      case "EditedPostTag": {
        const { __typename, ...rest } = editData.editPostTag.tag;

        onStatusChange("idle");
        handleOpenAlert("Post tag edited");
        onEdit(rest);
        break;
      }

      case "EditedPostTagWarning":
      default:
        onStatusChange("idle");
        setAlertIsOpen(true);
    }
  };

  return { alertIsOpen, setAlertIsOpen, onCompleted };
};

export default useEditPostTag;
