import * as React from "react";
import type { PostTagData } from "@features/postTags/types";
import type { PostTagsListAction } from "@features/postTags/GetPostTags/types";

interface ControlPlusAOptions {
  cachePostTags: PostTagData[];
  isDeleting: boolean;
  tagIdsLength: number;
  dispatch: React.Dispatch<PostTagsListAction>;
}

const useControlPlusA = (options: ControlPlusAOptions) => {
  const { cachePostTags, isDeleting, tagIdsLength, dispatch } = options;

  React.useEffect(() => {
    const handleControlPlusA = (e: KeyboardEvent) => {
      if (!isDeleting && e.ctrlKey && (e.key === "A" || e.key === "a")) {
        dispatch({
          type: "CTRL_A_SELECT_ALL",
          payload: {
            tags: cachePostTags,
            isNotAllSelected: tagIdsLength !== cachePostTags.length,
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
  }, [cachePostTags, isDeleting, tagIdsLength, dispatch]);
};

export default useControlPlusA;
