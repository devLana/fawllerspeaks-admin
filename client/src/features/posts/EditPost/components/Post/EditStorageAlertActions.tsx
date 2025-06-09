import { useRouter } from "next/router";

import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import useDeletePostContentImages from "@hooks/useDeletePostContentImages";
import * as storagePost from "@utils/posts/editStoragePost";
import type { EditPostAction } from "types/posts/editPost";

interface EditStorageAlertActionsProps {
  postId: string;
  dispatch: React.Dispatch<EditPostAction>;
}

const EditStorageAlertActions = (props: EditStorageAlertActionsProps) => {
  const { postId, dispatch } = props;
  const { push } = useRouter();

  const deleteImages = useDeletePostContentImages();

  const handleContinue = () => {
    const post = storagePost.getEditStoragePost();

    if (!post) {
      dispatch({ type: "HIDE_EDIT_STORAGE_POST_ALERT" });
      return;
    }

    const { id, slug, content, imgUrls } = post;

    if (id !== postId) {
      if (slug) {
        void push(`/posts/edit/${slug}`);
      } else {
        if (imgUrls) deleteImages(imgUrls);

        const query = { message: "edit-load-error" };
        void push({ pathname: "/posts", query });
        localStorage.removeItem(storagePost.EDIT_STORAGE_POST);
      }

      return;
    }

    if (content) {
      dispatch({ type: "LOAD_EDIT_STORAGE_POST", payload: { content } });
      return;
    }

    if (imgUrls) deleteImages(imgUrls);

    localStorage.removeItem(storagePost.EDIT_STORAGE_POST);
    dispatch({ type: "HIDE_EDIT_STORAGE_POST_ALERT" });
  };

  const handleCancel = () => {
    const post = storagePost.getEditStoragePost();

    if (post?.imgUrls) deleteImages(post.imgUrls);

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
