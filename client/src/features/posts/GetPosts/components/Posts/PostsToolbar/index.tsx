import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Toolbar from "@mui/material/Toolbar";

import useSelectAllCheckbox from "@hooks/useSelectAllCheckbox";
import type {
  GetPostsListAction,
  PostsPagePostData,
} from "types/posts/getPosts";

interface PostsToolbarProps {
  selectedPosts: Record<string, string>;
  selectedPostsIds: string[];
  viewButtons: React.ReactElement;
  posts: PostsPagePostData[];
  dispatch: React.Dispatch<GetPostsListAction>;
}

const PostsToolbar = ({
  selectedPosts,
  selectedPostsIds,
  viewButtons,
  posts,
  dispatch,
}: PostsToolbarProps) => {
  let postsSelected = 0;

  posts.forEach(({ id }) => {
    if (selectedPosts[id]) postsSelected++;
  });

  const checkboxRef = useSelectAllCheckbox(postsSelected, posts.length);
  const allSelected = postsSelected === posts.length;
  const label = selectedPostsIds.length === 1 ? "post" : "all selected posts";

  const handleSelect = (shouldSelectAll: boolean) => {
    dispatch({ type: "SELECT_ALL_POSTS", payload: { shouldSelectAll, posts } });
  };

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
    <Toolbar disableGutters variant="dense" sx={{ mb: 2, columnGap: 2 }}>
      <Checkbox
        inputRef={checkboxRef}
        id="all-posts-checkbox"
        size="small"
        inputProps={{
          "aria-label": `${allSelected ? "Unselect" : "Select"} all posts`,
        }}
        onChange={e => handleSelect(e.target.checked)}
        checked={allSelected}
        indeterminate={!(postsSelected === 0 || postsSelected === posts.length)}
        sx={{ ml: 0.75 }}
      />
      {selectedPostsIds.length > 0 && (
        <Button color="error" onClick={handleDelete}>
          Send {label} to bin
        </Button>
      )}
      {viewButtons}
    </Toolbar>
  );
};

export default PostsToolbar;
