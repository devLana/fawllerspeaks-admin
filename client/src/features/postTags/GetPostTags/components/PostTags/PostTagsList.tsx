import * as React from "react";

import Divider from "@mui/material/Divider";
import List from "@mui/material/List";

import { useGetCachedPostTags } from "@hooks/getPostTags/useGetCachedPostTags";
import useControlPlusA from "@hooks/useControlPlusA";
import useShiftPlusClickPostTags from "@hooks/getPostTags/useShiftPlusClickPostTags";
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
  const cachedPostTags = useGetCachedPostTags();

  if (!cachedPostTags) throw new Error();

  const selectedTagsIds = Object.keys(selectedTags);
  const shiftClick = useShiftPlusClickPostTags(cachedPostTags, dispatch);

  useControlPlusA(isNotDeleting, () => {
    dispatch({
      type: "SELECT_ALL_POST_TAGS",
      payload: {
        shouldSelectAll: selectedTagsIds.length !== cachedPostTags.length,
        tags: cachedPostTags,
      },
    });
  });

  const tagsList = React.useMemo(() => {
    return cachedPostTags.map((tag, index) => (
      <PostTag
        key={tag.id}
        {...tag}
        {...shiftClick}
        index={index}
        isChecked={!!selectedTags[tag.id]}
        dispatch={dispatch}
      />
    ));
  }, [cachedPostTags, shiftClick, selectedTags, dispatch]);

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
