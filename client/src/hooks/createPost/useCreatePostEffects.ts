import * as React from "react";

import { getStoragePost } from "@utils/posts/storagePost";
import type { CreatePostAction } from "types/posts/createPost";

const useCreatePostEffects = (
  blobUrl: string | undefined,
  dispatch: React.Dispatch<CreatePostAction>
) => {
  React.useEffect(() => {
    const post = getStoragePost();

    if (post) {
      dispatch({ type: "SET_STORAGE_POST", payload: { post } });
    }
  }, [dispatch]);

  React.useEffect(() => {
    return () => {
      if (blobUrl) {
        window.URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);
};

export default useCreatePostEffects;
