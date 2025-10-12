import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

import type * as types from "types/posts/getPosts";

interface ClearPageSelectionButtonProps {
  numOfPagePostsSelected: number;
  posts: types.PostsPagePostData[];
  dispatch: React.Dispatch<types.GetPostsListAction>;
}

const ClearPageSelectionButton = (props: ClearPageSelectionButtonProps) => {
  const { numOfPagePostsSelected, posts, dispatch } = props;

  if (numOfPagePostsSelected === 0) return null;

  const handleClick = () => {
    dispatch({ type: "CLEAR_PAGE_POSTS_SELECTION", payload: { posts } });
  };

  return (
    <>
      <Divider
        aria-hidden="true"
        orientation="vertical"
        variant="middle"
        flexItem
      />
      <Tooltip placement="bottom" title="Clear page selection">
        <IconButton color="inherit" onClick={handleClick}>
          <CancelPresentationIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default ClearPageSelectionButton;
