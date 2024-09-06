import * as React from "react";

import Divider from "@mui/material/Divider";
import List from "@mui/material/List";

import { useGetCachePostTags } from "@features/postTags/GetPostTags/hooks/useGetCachePostTags";
import useControlPlusA from "../hooks/useControlPlusA";
import PostTagsToolbar from "./PostTagsToolbar";
import PostTag from "./PostTag";
import type {
  PostTagsListAction,
  PostTagsListState,
} from "@features/postTags/GetPostTags/types";

interface PostTagsListProps {
  tagIdsLength: number;
  selectedTags: PostTagsListState["selectedTags"];
  deleteTag: PostTagsListState["deleteTag"];
  deleteTags: PostTagsListState["deleteTags"];
  dispatch: React.Dispatch<PostTagsListAction>;
}

const PostTagsList = (props: PostTagsListProps) => {
  const { deleteTag, deleteTags, selectedTags, tagIdsLength, dispatch } = props;
  const anchorTag = React.useRef<string | null>(null);

  const cachePostTags = useGetCachePostTags();

  if (!cachePostTags) throw new Error();

  useControlPlusA({
    cachePostTags,
    isDeleting: deleteTag.open || deleteTags,
    tagIdsLength,
    dispatch,
  });

  const handleShiftClick = React.useCallback(
    (shiftKey: boolean, id: string) => {
      if (!shiftKey) {
        anchorTag.current = id;
        return;
      }

      if (anchorTag.current && anchorTag.current !== id) {
        dispatch({
          type: "SHIFT_PLUS_CLICK",
          payload: { anchorTagId: anchorTag.current, id, tags: cachePostTags },
        });
      }
    },
    [cachePostTags, dispatch]
  );

  const tagsList = React.useMemo(() => {
    return cachePostTags.map(({ id, name }) => (
      <PostTag
        key={id}
        id={id}
        name={name}
        isChecked={!!selectedTags[id]}
        onClickLabel={handleShiftClick}
        dispatch={dispatch}
      />
    ));
  }, [cachePostTags, selectedTags, handleShiftClick, dispatch]);

  const handleAllCheckboxChange = (checked: boolean) => {
    dispatch({
      type: "SELECT_UNSELECT_ALL_CHECKBOX",
      payload: { checked, tags: cachePostTags },
    });
  };

  return (
    <>
      <PostTagsToolbar
        numberOfSelectedPostTags={tagIdsLength}
        totalNumberOfPostTags={cachePostTags.length}
        onAllCheckboxChange={value => handleAllCheckboxChange(value)}
        dispatch={dispatch}
      />
      <Divider sx={{ mt: 1, mb: 3.5 }} />
      <List
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          rowGap: 2.5,
          columnGap: { columnGap: 8, sm: 2.5 },
        }}
      >
        {tagsList}
      </List>
    </>
  );
};

export default PostTagsList;
