import * as React from "react";
import type {
  GetPostsListAction,
  PostsPagePostData,
} from "types/posts/getPosts";

const useShiftPlusClickPosts = (
  posts: PostsPagePostData[],
  dispatch: React.Dispatch<GetPostsListAction>
) => {
  const skipOnChange = React.useRef(false);
  const anchorPost = React.useRef<{ id: string; index: number } | null>(null);
  const prevTargetIndex = React.useRef<number | null>(null);

  const onShiftPlusClick = React.useCallback(
    (shiftKey: boolean, index: number, id: string) => {
      if (!shiftKey) {
        anchorPost.current = { index, id };
        prevTargetIndex.current = null;
      } else if (
        anchorPost.current &&
        index !== anchorPost.current.index &&
        index !== anchorPost.current.index - 1 &&
        index !== anchorPost.current.index + 1
      ) {
        dispatch({
          type: "SHIFT_PLUS_CLICK",
          payload: {
            anchorPost: anchorPost.current,
            targetIndex: index,
            prevTargetIndex: prevTargetIndex.current,
            posts,
          },
        });

        skipOnChange.current = true;
        prevTargetIndex.current = index;
      }
    },
    [posts, dispatch]
  );

  return { onShiftPlusClick, skipOnChange };
};

export default useShiftPlusClickPosts;
