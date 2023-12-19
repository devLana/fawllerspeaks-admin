import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { usePostTags } from "@features/postTags/context/PostTagsContext";
import { DELETE_POST_TAGS } from "./operations/DELETE_POST_TAGS";
import { formatText } from "./utils/formatText";
import { update } from "./utils/update";
import { refetchQueries } from "./utils/refetchQueries";

export interface DeletePostTagsProps {
  open: boolean;
  name: string;
  ids: string[];
  onCloseDelete: () => void;
  onClearSelection: (deletedTags?: string[]) => void;
}

const DeletePostTags = (props: DeletePostTagsProps) => {
  const { open, ids, name, onCloseDelete, onClearSelection } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const { replace } = useRouter();

  const [deleteTags, { client }] = useMutation(DELETE_POST_TAGS);

  const { handleOpenAlert } = usePostTags();

  const handleResponse = (message: string) => {
    onCloseDelete();
    handleOpenAlert(message);
    setIsLoading(false);
  };

  const msg =
    "You are unable to delete post tags at the moment. Please try again later";

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
            void client.clearStore();
            void replace("/login?status=unauthenticated");
            break;

          case "NotAllowedError":
            void client.clearStore();
            void replace("/login?status=unauthorized");
            break;

          case "RegistrationError":
            void replace("/register?status=unregistered");
            break;

          case "DeletePostTagsValidationError":
            handleResponse(data.deletePostTags.tagIdsError);
            onClearSelection();
            break;

          case "UnknownError":
          case "DeletedPostTagsWarning":
            handleResponse(data.deletePostTags.message);
            onClearSelection();
            break;

          case "DeletedPostTags": {
            const word = data.deletePostTags.tagIds.length > 1 ? "tags" : "tag";

            handleResponse(`Post ${word} deleted`);
            onClearSelection(data.deletePostTags.tagIds);
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
      onClose={isLoading ? undefined : onCloseDelete}
      aria-labelledby="delete-post-tags-dialog"
    >
      <DialogTitle id="delete-post-tags-dialog" sx={{ textAlign: "center" }}>
        Delete post {tagOrTags}
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <DialogContentText gutterBottom>
          Are you sure you want to delete&nbsp;
          <Typography variant="caption" fontSize="1em" fontWeight="bold">
            {name}
          </Typography>
          {formatText(ids.length)}
        </DialogContentText>
        <DialogContentText sx={{ textAlign: "center" }}>
          Any post tag you delete will also be deleted from posts it was
          assigned to.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button disabled={isLoading} onClick={onCloseDelete}>
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
