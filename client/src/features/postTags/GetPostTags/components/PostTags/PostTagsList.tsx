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
  id: string;
  selectedTags: PostTagsListState["selectedTags"];
  isNotDeleting: PostTagsListState["delete"]["open"];
  dispatch: React.Dispatch<PostTagsListAction>;
}

const PostTagsList = (props: PostTagsListProps) => {
  const { id, isNotDeleting, selectedTags, dispatch } = props;
  const anchorTag = React.useRef<{ id: string; index: number } | null>(null);
  const cachedPostTags = useGetCachedPostTags();

  if (!cachedPostTags) throw new Error();

  const selectedTagsIds = Object.keys(selectedTags);

  useControlPlusA({
    cachedPostTags,
    isNotDeleting,
    tagIdsLength: selectedTagsIds.length,
    dispatch,
  });

  const handleShiftClick = React.useCallback(
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

  const tagsList = React.useMemo(() => {
    return cachedPostTags.map((tag, index) => (
      <PostTag
        key={tag.id}
        {...tag}
        index={index}
        isChecked={!!selectedTags[tag.id]}
        onClickLabel={handleShiftClick}
        dispatch={dispatch}
      />
    ));
  }, [cachedPostTags, selectedTags, handleShiftClick, dispatch]);

  const handleAllCheckboxChange = (isChecked: boolean) => {
    dispatch({
      type: "SELECT_ALL_POST_TAGS",
      payload: { shouldSelectAll: isChecked, tags: cachedPostTags },
    });
  };

  const handleDelete = () => {
    dispatch({
      type: "OPEN_DELETE",
      payload: { ids: selectedTagsIds, name: selectedTags[selectedTagsIds[0]] },
    });
  };

  return (
    <>
      <PostTagsToolbar
        totalNumberOfPostTags={cachedPostTags.length}
        numberOfSelectedPostTags={selectedTagsIds.length}
        handleAllCheckboxChange={handleAllCheckboxChange}
        handleDelete={handleDelete}
      />
      <Divider sx={{ mt: 1, mb: 3.5 }} />
      <List
        aria-labelledby={id}
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
