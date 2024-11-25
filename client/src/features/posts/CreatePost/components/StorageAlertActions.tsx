import { useMutation } from "@apollo/client";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { DELETE_POST_CONTENT_IMAGES } from "@mutations/deletePostContentImages/DELETE_POST_CONTENT_IMAGES";
import { STORAGE_POST, SUPABASE_HOST } from "@utils/posts/constants";
import type { CreatePostAction, StoragePostData } from "types/posts/createPost";

interface StorageAlertActionsProps {
  dispatch: React.Dispatch<CreatePostAction>;
  storagePost: StoragePostData;
}

const StorageAlertActions = (props: StorageAlertActionsProps) => {
  const { dispatch, storagePost } = props;

  const [deleteImages] = useMutation(DELETE_POST_CONTENT_IMAGES);

  const handleContinue = () => {
    dispatch({ type: "LOAD_STORAGE_POST", payload: { post: storagePost } });
  };

  const handleCancel = () => {
    const { content } = storagePost;

    if (content) {
      const domParser = new DOMParser();
      const doc = domParser.parseFromString(content, "text/html");
      const imgs = doc.querySelectorAll<HTMLImageElement>("img");
      const imgElements = Array.from(imgs);

      const images = imgElements.reduce((sources: string[], img) => {
        if (img.src && img.src.startsWith(SUPABASE_HOST)) {
          sources.push(img.src);
        }

        return sources;
      }, []);

      if (images.length > 0) {
        void deleteImages({ variables: { images } });
      }
    }

    localStorage.removeItem(STORAGE_POST);
    dispatch({ type: "UNSET_STORAGE_POST" });
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

export default StorageAlertActions;
