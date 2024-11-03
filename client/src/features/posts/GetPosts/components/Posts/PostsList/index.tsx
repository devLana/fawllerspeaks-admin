import Alert from "@mui/material/Alert";
import List from "@mui/material/List";

import Post from "./Post";
import type { PostsPagePostData, PostsView } from "types/posts/getPosts";

interface PostsListProps {
  postsView: PostsView;
  posts: PostsPagePostData[];
}

const PostsList = ({ postsView, posts }: PostsListProps) => {
  if (posts.length === 0) {
    return (
      <Alert severity="info" role="status" sx={{ mt: 10 }}>
        No posts found
      </Alert>
    );
  }

  return (
    <List
      aria-label="Blog posts"
      disablePadding
      sx={{
        ...(postsView === "grid" && {
          display: "grid",
          gridTemplateColumns: {
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          },
          columnGap: 2.5,
          rowGap: 7,
        }),
      }}
    >
      {posts.map(({ id, ...post }) => (
        <Post key={id} {...post} isLoadingMore={false} postsView={postsView} />
      ))}
    </List>
  );
};

export default PostsList;
