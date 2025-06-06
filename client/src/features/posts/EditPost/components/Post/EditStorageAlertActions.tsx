import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { DELETE_POST_CONTENT_IMAGES } from "@mutations/deletePostContentImages/DELETE_POST_CONTENT_IMAGES";
import * as storagePost from "@utils/posts/editStoragePost";
import type { EditPostAction } from "types/posts/editPost";

interface EditStorageAlertActionsProps {
  postId: string;
  dispatch: React.Dispatch<EditPostAction>;
}

const EditStorageAlertActions = (props: EditStorageAlertActionsProps) => {
  const { postId, dispatch } = props;
  const { push } = useRouter();

  const [deleteImages] = useMutation(DELETE_POST_CONTENT_IMAGES);

  const handleContinue = () => {
    const post = storagePost.getEditStoragePost();

    if (post) {
      const { content } = post;

      if (post.id === postId) {
        dispatch({ type: "LOAD_EDIT_STORAGE_POST", payload: { content } });
      } else {
        void push(`/posts/edit/${post.slug}`);
      }
    } else {
      dispatch({ type: "HIDE_EDIT_STORAGE_POST_ALERT" });
    }
  };

  const handleCancel = () => {
    const post = storagePost.getEditStoragePost();

    if (post?.imgUrls) {
      void deleteImages({ variables: { images: post.imgUrls } });
    }

    localStorage.removeItem(storagePost.EDIT_STORAGE_POST);
    dispatch({ type: "HIDE_EDIT_STORAGE_POST_ALERT" });
  };

  return (
    <>
      <IconButton
        aria-label="Continue with unfinished post"
        size="small"
        color="inherit"
        onClick={handleContinue}
      >
        <CheckIcon />
      </IconButton>
      <IconButton
        aria-label="Delete unfinished post"
        size="small"
        color="inherit"
        onClick={handleCancel}
      >
        <CloseIcon />
      </IconButton>
    </>
  );
};

export default EditStorageAlertActions;
