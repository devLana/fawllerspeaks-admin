import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";

import type { GetPostsListAction } from "types/posts/getPosts";

interface AllSelectedPostsActionsProps {
  selectedPosts: Record<string, string>;
  selectedPostsIds: string[];
  postsLength: number;
  pagePostsSelected: number;
  dispatch: React.Dispatch<GetPostsListAction>;
}

const AllSelectedPostsActions = ({
  selectedPosts,
  selectedPostsIds,
  pagePostsSelected,
  postsLength,
  dispatch,
}: AllSelectedPostsActionsProps) => {
  if (selectedPostsIds.length === 0) return null;

  let label: string;

  if (selectedPostsIds.length === 1) {
    label = "post";
  } else if (
    pagePostsSelected === postsLength &&
    pagePostsSelected === selectedPostsIds.length
  ) {
    label = "all posts on this page";
  } else {
    label = "all selected posts";
  }

  const handleDelete = () => {
    dispatch({
      type: "OPEN_DELETE",
      payload: {
        ids: selectedPostsIds,
        title: selectedPosts[selectedPostsIds[0]],
      },
    });
  };

  return (
    <>
      <Tooltip placement="bottom" title="Clear all posts selection">
        <IconButton
          color="inherit"
          onClick={() => dispatch({ type: "CLEAR_ALL_POSTS_SELECTION" })}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip placement="bottom" title={`Send ${label} to bin`}>
        <IconButton color="inherit" onClick={handleDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default AllSelectedPostsActions;
