import * as React from "react";
import type { PostTagData } from "types/postTags";
import type { PostTagsListAction } from "types/postTags/getPostTags";

interface ControlPlusAOptions {
  cachedPostTags: PostTagData[];
  isDeleting: boolean;
  tagIdsLength: number;
  dispatch: React.Dispatch<PostTagsListAction>;
}

const useControlPlusA = (options: ControlPlusAOptions) => {
  const { cachedPostTags, isDeleting, tagIdsLength, dispatch } = options;

  React.useEffect(() => {
    const handleControlPlusA = (e: KeyboardEvent) => {
      if (!isDeleting && e.ctrlKey && (e.key === "A" || e.key === "a")) {
        dispatch({
          type: "CTRL_A_SELECT_ALL",
          payload: {
            tags: cachedPostTags,
            isNotAllSelected: tagIdsLength !== cachedPostTags.length,
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
  }, [cachedPostTags, isDeleting, tagIdsLength, dispatch]);
};

export default useControlPlusA;
