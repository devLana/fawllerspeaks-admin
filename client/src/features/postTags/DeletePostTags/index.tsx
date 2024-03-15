import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";

import { usePostTagsPage } from "@features/postTags/context/PostTagsPageContext";
import DeletePostTagsTextFormatter from "./components/DeletePostTagsTextFormatter";
import { DELETE_POST_TAGS } from "./operations/DELETE_POST_TAGS";
import { update } from "./utils/update";
import { refetchQueries } from "./utils/refetchQueries";
import { SESSION_ID } from "@utils/constants";
import type { PostTagsListAction } from "@types";

export interface DeletePostTagsProps {
  open: boolean;
  name: string;
  ids: string[];
  onClose: () => void;
  dispatch: React.Dispatch<PostTagsListAction>;
}

const DeletePostTags = (props: DeletePostTagsProps) => {
  const { open, name, ids, onClose, dispatch } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const { replace } = useRouter();

  const [deleteTags, { client }] = useMutation(DELETE_POST_TAGS);

  const { handleOpenAlert } = usePostTagsPage();

  const msg =
    "You are unable to delete post tags at the moment. Please try again later";

  const handleResponse = (message: string) => {
    onClose();
    handleOpenAlert(message);
    setIsLoading(false);
  };

  const handleDelete = () => {
    setIsLoading(true);

    void deleteTags({
      variables: { tagIds: ids },
      update,
      refetchQueries,
      onError: err => handleResponse(err.graphQLErrors[0]?.message ?? msg),
      onCompleted(data) {
        switch (data.deletePostTags.__typename) {
          case "AuthenticationError":
            localStorage.removeItem(SESSION_ID);
            void client.clearStore();
            void replace("/login?status=unauthenticated");
            break;

          case "NotAllowedError":
            localStorage.removeItem(SESSION_ID);
            void client.clearStore();
            void replace("/login?status=unauthorized");
            break;

          case "RegistrationError":
            void replace("/register?status=unregistered");
            break;

          case "DeletePostTagsValidationError":
            handleResponse(data.deletePostTags.tagIdsError);
            dispatch({ type: "CLEAR_SELECTION" });
            break;

          case "UnknownError":
          case "DeletedPostTagsWarning":
            handleResponse(data.deletePostTags.message);
            dispatch({ type: "CLEAR_SELECTION" });
            break;

          case "DeletedPostTags": {
            const { tagIds: deletedTags } = data.deletePostTags;
            const word = deletedTags.length > 1 ? "tags" : "tag";

            handleResponse(`Post ${word} deleted`);
            dispatch({ type: "CLEAR_SELECTION", payload: { deletedTags } });
            break;
          }

          default:
            handleResponse(msg);
        }
      },
    });
  };

  const tagOrTags = ids.length > 1 ? "Tags" : "Tag";

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      aria-labelledby="delete-post-tags-dialog"
    >
      <DialogTitle id="delete-post-tags-dialog" sx={{ textAlign: "center" }}>
        Delete post {tagOrTags}
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <DialogContentText gutterBottom>
          Are you sure you want to delete&nbsp;
          <DeletePostTagsTextFormatter name={name} idsLength={ids.length} />?
        </DialogContentText>
        <DialogContentText sx={{ textAlign: "center" }}>
          Any post tag you delete will also be deleted from posts it was
          assigned to.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button disabled={isLoading} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          color="error"
          onClick={handleDelete}
          loading={isLoading}
          variant="contained"
        >
          <span>Delete {tagOrTags}</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePostTags;
