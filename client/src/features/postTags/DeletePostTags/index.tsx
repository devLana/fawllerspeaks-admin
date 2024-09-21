import * as React from "react";

import { useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";

import { usePostTagsPage } from "@context/PostTags";
import DeletePostTagsMessage from "./DeletePostTagsMessage";
import { DELETE_POST_TAGS } from "@mutations/deletePostTags/DELETE_POST_TAGS";
import { update } from "./cache/update";
import { refetchQueries } from "./cache/refetchQueries";
import type { PostTagsListAction } from "types/postTags/getPostTags";
import useDeletePostTags from "@hooks/deletePostTags/useDeletePostTags";

interface DeletePostTagsProps {
  open: boolean;
  name: string;
  ids: string[];
  onClose: () => void;
  dispatch: React.Dispatch<PostTagsListAction>;
}

const DeletePostTags = (props: DeletePostTagsProps) => {
  const { open, name, ids, onClose, dispatch } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const [deleteTags] = useMutation(DELETE_POST_TAGS);

  const msg =
    "You are unable to delete post tags at the moment. Please try again later";

  const { handleOpenAlert } = usePostTagsPage();
  const onCompleted = useDeletePostTags(msg, dispatch, handleResponse);

  const handleDelete = () => {
    setIsLoading(true);

    void deleteTags({
      variables: { tagIds: ids },
      update,
      refetchQueries,
      onError: err => handleResponse(err.graphQLErrors?.[0]?.message ?? msg),
      onCompleted,
    });
  };

  function handleResponse(message: string) {
    onClose();
    handleOpenAlert(message);
    setIsLoading(false);
  }

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
          <DeletePostTagsMessage name={name} idsLength={ids.length} />?
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
