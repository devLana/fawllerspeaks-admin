import * as React from "react";

import useDeletePostContentImages from "@hooks/useDeletePostContentImages";
import * as storage from "@utils/posts/editStoragePost";
import type { EditPostAction } from "types/posts/editPost";

const useEditPostEffects = (
  hasRenderedBeforeRef: boolean,
  onRendered: () => void,
  dispatch: React.Dispatch<EditPostAction>
) => {
  const deleteImages = useDeletePostContentImages();

  React.useEffect(() => {
    if (!hasRenderedBeforeRef) {
      const post = storage.getEditStoragePost();

      if (post && post.content) {
        dispatch({ type: "SHOW_EDIT_STORAGE_POST_ALERT" });
      } else if (post && post.imgUrls) {
        deleteImages(post.imgUrls);
        localStorage.removeItem(storage.EDIT_STORAGE_POST);
      } else {
        localStorage.removeItem(storage.EDIT_STORAGE_POST);
      }

      onRendered();
    }
  }, [hasRenderedBeforeRef, onRendered, dispatch, deleteImages]);

  React.useEffect(() => {
    if (hasRenderedBeforeRef) {
      const post = storage.getEditStoragePost();

      if (post && post.content) {
        const { content } = post;
        dispatch({ type: "LOAD_EDIT_STORAGE_POST", payload: { content } });
      } else if (post && post.imgUrls) {
        deleteImages(post.imgUrls);
        localStorage.removeItem(storage.EDIT_STORAGE_POST);
      } else {
        localStorage.removeItem(storage.EDIT_STORAGE_POST);
      }
    }
  }, [hasRenderedBeforeRef, dispatch, deleteImages]);
};

export default useEditPostEffects;
