import * as React from "react";
import type { PostTagData } from "types/postTags";
import type { PostTagsListAction } from "types/postTags/getPostTags";

const useShiftPlusClickPostTags = (
  cachedPostTags: PostTagData[],
  dispatch: React.Dispatch<PostTagsListAction>
) => {
  const anchorTag = React.useRef<{ id: string; index: number } | null>(null);

  return React.useCallback(
    (shiftKey: boolean, index: number, tagId: string) => {
      if (!shiftKey) {
        anchorTag.current = { index, id: tagId };
      } else if (anchorTag.current && anchorTag.current.index !== index) {
        dispatch({
          type: "SHIFT_PLUS_CLICK",
          payload: {
            anchorTagId: anchorTag.current.id,
            anchorTagIndex: anchorTag.current.index,
            targetIndex: index,
            tags: cachedPostTags,
          },
        });
      }
    },
    [cachedPostTags, dispatch]
  );
};

export default useShiftPlusClickPostTags;
