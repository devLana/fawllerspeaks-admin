import Toolbar from "@mui/material/Toolbar";

import AllSelectedPostsActions from "./AllSelectedPostsActions";
import ClearPageSelectionButton from "./ClearPageSelectionButton";
import SelectPostsControl from "./SelectPostsControl";
import type * as types from "types/posts/getPosts";

interface PostsToolbarProps {
  selectedPosts: Record<string, string>;
  selectedPostsIds: string[];
  viewButtons: React.ReactElement;
  posts: types.PostsPagePostData[];
  dispatch: React.Dispatch<types.GetPostsListAction>;
}

const PostsToolbar = ({
  selectedPosts,
  selectedPostsIds,
  viewButtons,
  posts,
  dispatch,
}: PostsToolbarProps) => {
  const pagePostsSelected = posts.reduce((numberOfSelectedPosts, { id }) => {
    let numberOfPagePostsSelected = numberOfSelectedPosts;

    if (selectedPosts[id]) numberOfPagePostsSelected++;

    return numberOfPagePostsSelected;
  }, 0);

  return (
    <Toolbar
      disableGutters
      variant="dense"
      sx={{ mb: 5, columnGap: { columnGap: 8, md: 3 } }}
    >
      <SelectPostsControl
        pagePostsSelected={pagePostsSelected}
        posts={posts}
        dispatch={dispatch}
      />
      <AllSelectedPostsActions
        selectedPosts={selectedPosts}
        selectedPostsIds={selectedPostsIds}
        postsLength={posts.length}
        pagePostsSelected={pagePostsSelected}
        dispatch={dispatch}
      />
      <ClearPageSelectionButton
        numOfPagePostsSelected={pagePostsSelected}
        posts={posts}
        dispatch={dispatch}
      />
      {viewButtons}
    </Toolbar>
  );
};

export default PostsToolbar;
