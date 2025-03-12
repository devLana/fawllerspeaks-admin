import * as React from "react";

import { getStoragePost } from "@utils/posts/storagePost";
import type { CreatePostAction } from "types/posts/createPost";

const useCreatePostEffects = (
  fileUrl: string | null,
  dispatch: React.Dispatch<CreatePostAction>
) => {
  React.useEffect(() => {
    const post = getStoragePost();

    if (post) dispatch({ type: "SHOW_STORAGE_POST_ALERT" });
  }, [dispatch]);

  React.useEffect(() => {
    return () => {
      if (fileUrl) window.URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);
};

export default useCreatePostEffects;
