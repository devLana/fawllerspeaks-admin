import * as React from "react";

import { getStoragePost } from "@utils/posts/storagePost";
import type { CreatePostAction } from "types/posts/createPost";

const useCreatePostEffects = (dispatch: React.Dispatch<CreatePostAction>) => {
  React.useEffect(() => {
    const post = getStoragePost();

    if (post) dispatch({ type: "SHOW_STORAGE_POST_ALERT" });
  }, [dispatch]);
};

export default useCreatePostEffects;
