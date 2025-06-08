import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import useDeletePostContentImages from "@hooks/createPost/useDeletePostContentImages";
import * as storagePost from "@utils/posts/createStoragePost";
import type { CreatePostAction } from "types/posts/createPost";

type Dispatch = React.Dispatch<CreatePostAction>;

const CreateStorageAlertActions = ({ dispatch }: { dispatch: Dispatch }) => {
  const deleteImages = useDeletePostContentImages();

  const handleContinue = () => {
    const post = storagePost.getCreateStoragePost();

    if (post) {
      dispatch({ type: "LOAD_CREATE_STORAGE_POST", payload: { post } });
    } else {
      dispatch({ type: "HIDE_CREATE_STORAGE_POST_ALERT" });
    }
  };

  const handleCancel = () => {
    const post = storagePost.getCreateStoragePost();

    if (post?.content) deleteImages(post.content);

    localStorage.removeItem(storagePost.CREATE_STORAGE_POST);
    dispatch({ type: "HIDE_CREATE_STORAGE_POST_ALERT" });
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

export default CreateStorageAlertActions;
