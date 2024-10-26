import * as React from "react";
import type { PostTagData } from "types/postTags";
import type { PostTagsListAction } from "types/postTags/getPostTags";

interface ControlPlusAOptions {
  cachedPostTags: PostTagData[];
  isNotDeleting: boolean;
  tagIdsLength: number;
  dispatch: React.Dispatch<PostTagsListAction>;
}

const useControlPlusA = (options: ControlPlusAOptions) => {
  const { cachedPostTags, isNotDeleting, tagIdsLength, dispatch } = options;

  React.useEffect(() => {
    const handleControlPlusA = (e: KeyboardEvent) => {
      if (isNotDeleting && e.ctrlKey && (e.key === "A" || e.key === "a")) {
        dispatch({
          type: "SELECT_ALL_POST_TAGS",
          payload: {
            shouldSelectAll: tagIdsLength !== cachedPostTags.length,
            tags: cachedPostTags,
          },
        });
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "A" || e.key === "a")) e.preventDefault();
    };

    window.addEventListener("keyup", handleControlPlusA);
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keyup", handleControlPlusA);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [cachedPostTags, isNotDeleting, tagIdsLength, dispatch]);
};

export default useControlPlusA;
