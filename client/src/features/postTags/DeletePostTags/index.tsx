import { useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";

import useDeletePostTags from "@hooks/deletePostTags/useDeletePostTags";
import DeletePostTagsMessage from "./DeletePostTagsMessage";
import { DELETE_POST_TAGS } from "@mutations/deletePostTags/DELETE_POST_TAGS";
import { update } from "@cache/update/postTags/deletePostTags";
import { refetchQueries } from "@cache/refetchQueries/postTags/deletePostTags";
import type { DeletePostTagsProps } from "types/postTags/deletePostTags";

const DeletePostTags = ({ open, name, ids, dispatch }: DeletePostTagsProps) => {
  const [deleteTags] = useMutation(DELETE_POST_TAGS);

  const { onCompleted, onError, isLoading, setIsLoading } = useDeletePostTags(
    handleRemoveTags,
    handleClose
  );

  const handleDelete = () => {
    setIsLoading(true);

    void deleteTags({
      variables: { tagIds: ids },
      update,
      refetchQueries,
      onError,
      onCompleted,
    });
  };

  function handleClose() {
    dispatch({ type: "CLOSE_DELETE" });
  }

  function handleRemoveTags() {
    dispatch({
      type: "REMOVE_POST_TAG_ON_DELETE",
      payload: { tagIds: ids },
    });
  }

  const tagOrTags = ids.length > 1 ? "Tags" : "Tag";

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : handleClose}
      aria-labelledby="delete-post-tags-dialog"
    >
      <DialogTitle id="delete-post-tags-dialog" sx={{ textAlign: "center" }}>
        Delete post {tagOrTags}
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <DialogContentText gutterBottom>
          Are you sure you want to delete{" "}
          <DeletePostTagsMessage name={name} idsLength={ids.length} />?
        </DialogContentText>
        <DialogContentText sx={{ textAlign: "center" }}>
          Any post tag you delete will also be deleted from posts it was
          assigned to.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button disabled={isLoading} onClick={handleClose}>
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
