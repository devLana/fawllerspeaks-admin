import * as React from "react";

import Divider from "@mui/material/Divider";
import List from "@mui/material/List";

import { useGetCachedPostTags } from "@hooks/getPostTags/useGetCachedPostTags";
import useControlPlusA from "@hooks/getPostTags/useControlPlusA";
import PostTagsToolbar from "./PostTagsToolbar";
import PostTag from "./PostTag";
import type {
  PostTagsListAction,
  PostTagsListState,
} from "types/postTags/getPostTags";

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

  const cachedPostTags = useGetCachedPostTags();

  if (!cachedPostTags) throw new Error();

  useControlPlusA({
    cachedPostTags,
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
          payload: { anchorTagId: anchorTag.current, id, tags: cachedPostTags },
        });
      }
    },
    [cachedPostTags, dispatch]
  );

  const tagsList = React.useMemo(() => {
    return cachedPostTags.map(({ id, name }) => (
      <PostTag
        key={id}
        id={id}
        name={name}
        isChecked={!!selectedTags[id]}
        onClickLabel={handleShiftClick}
        dispatch={dispatch}
      />
    ));
  }, [cachedPostTags, selectedTags, handleShiftClick, dispatch]);

  const handleAllCheckboxChange = (checked: boolean) => {
    dispatch({
      type: "SELECT_UNSELECT_ALL_CHECKBOX",
      payload: { checked, tags: cachedPostTags },
    });
  };

  return (
    <>
      <PostTagsToolbar
        numberOfSelectedPostTags={tagIdsLength}
        totalNumberOfPostTags={cachedPostTags.length}
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
