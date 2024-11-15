import * as React from "react";
import type { PostTagData } from "types/postTags";
import type { PostTagsListAction } from "types/postTags/getPostTags";

const useShiftPlusClickPostTags = (
  cachedPostTags: PostTagData[],
  dispatch: React.Dispatch<PostTagsListAction>
) => {
  const skipOnChange = React.useRef(false);
  const anchorTag = React.useRef<{ id: string; index: number } | null>(null);

  const onShiftPlusClick = React.useCallback(
    (shiftKey: boolean, index: number, id: string) => {
      if (!shiftKey) {
        anchorTag.current = { index, id };
      } else if (anchorTag.current && index !== anchorTag.current.index) {
        skipOnChange.current = true;

        dispatch({
          type: "SHIFT_PLUS_CLICK",
          payload: {
            anchorTag: anchorTag.current,
            targetIndex: index,
            tags: cachedPostTags,
          },
        });
      }
    },
    [cachedPostTags, dispatch]
  );

  return React.useMemo(() => {
    return { onShiftPlusClick, skipOnChange };
  }, [onShiftPlusClick]);
};

export default useShiftPlusClickPostTags;
