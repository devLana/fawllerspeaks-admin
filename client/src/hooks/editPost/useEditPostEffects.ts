import * as React from "react";

import { getEditStoragePost } from "@utils/posts/editStoragePost";
import type { EditPostAction } from "types/posts/editPost";

const useEditPostEffects = (
  hasRenderedBeforeRef: boolean,
  onRendered: () => void,
  dispatch: React.Dispatch<EditPostAction>
) => {
  React.useEffect(() => {
    if (!hasRenderedBeforeRef) {
      const post = getEditStoragePost();

      if (post) dispatch({ type: "SHOW_EDIT_STORAGE_POST_ALERT" });

      onRendered();
    }
  }, [hasRenderedBeforeRef, onRendered, dispatch]);

  React.useEffect(() => {
    if (hasRenderedBeforeRef) {
      const post = getEditStoragePost();

      if (post?.content) {
        dispatch({
          type: "LOAD_EDIT_STORAGE_POST",
          payload: { content: post.content },
        });
      }
    }
  }, [hasRenderedBeforeRef, dispatch]);
};

export default useEditPostEffects;
