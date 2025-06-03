import * as React from "react";

import { getCreateStoragePost } from "@utils/posts/createStoragePost";
import type { CreatePostAction } from "types/posts/createPost";

const useCreatePostEffects = (dispatch: React.Dispatch<CreatePostAction>) => {
  React.useEffect(() => {
    const post = getCreateStoragePost();

    if (post) dispatch({ type: "SHOW_CREATE_STORAGE_POST_ALERT" });
  }, [dispatch]);
};

export default useCreatePostEffects;
