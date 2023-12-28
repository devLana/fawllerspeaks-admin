import * as React from "react";

import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";

import { useGetCachePostTags } from "@features/postTags/hooks/useGetCachePostTags";
import { usePostTagsList } from "@features/postTags/context/PostTagsListContext";
import { usePostTagsListDispatch } from "@features/postTags/context/PostTagsListDispatchContext";
import PostTagsToolbar from "./PostTagsToolbar";
import PostTag from "./PostTag";

const PostTagsList = ({ tagIdsLength }: { tagIdsLength: number }) => {
  const anchorTag = React.useRef<string | null>(null);

  const cachedTags = useGetCachePostTags();
  const { selectedTags, deleteTag, deleteTags } = usePostTagsList();
  const dispatch = usePostTagsListDispatch();

  if (!cachedTags) throw new Error();

  React.useEffect(() => {
    const handleControlPlusA = (e: KeyboardEvent) => {
      const isDeleting = deleteTag.open || deleteTags;

      if (!isDeleting && e.ctrlKey && (e.key === "A" || e.key === "a")) {
        dispatch({
          type: "CTRL_A_SELECT_ALL",
          payload: {
            tags: cachedTags,
            isNotAllSelected: tagIdsLength !== cachedTags.length,
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
  }, [cachedTags, deleteTags, deleteTag.open, tagIdsLength, dispatch]);

  const handleShiftClick = React.useCallback(
    (shiftKey: boolean, id: string) => {
      if (!shiftKey) {
        anchorTag.current = id;
        return;
      }

      if (anchorTag.current && anchorTag.current !== id) {
        dispatch({
          type: "SHIFT_PLUS_CLICK",
          payload: { anchorTagId: anchorTag.current, id, tags: cachedTags },
        });
      }
    },
    [cachedTags, dispatch]
  );

  const tagsList = React.useMemo(() => {
    return cachedTags.map(({ id, name }) => (
      <PostTag
        key={id}
        id={id}
        name={name}
        isChecked={!!selectedTags[id]}
        onClickLabel={handleShiftClick}
      />
    ));
  }, [cachedTags, selectedTags, handleShiftClick]);

  const handleAllCheckboxChange = (checked: boolean) => {
    dispatch({
      type: "SELECT_UNSELECT_ALL_CHECKBOX",
      payload: { checked, tags: cachedTags },
    });
  };

  return (
    <div aria-busy={false}>
      <PostTagsToolbar
        numberOfSelectedPostTags={tagIdsLength}
        totalNumberOfPostTags={cachedTags.length}
        onAllCheckboxChange={value => handleAllCheckboxChange(value)}
      />
      <Divider sx={{ mt: 1, mb: 3.5 }} />
      <Grid
        component={List}
        container
        rowSpacing={2.5}
        columnSpacing={{ xs: 2, sm: 4 }}
      >
        {tagsList}
      </Grid>
    </div>
  );
};

export default PostTagsList;
