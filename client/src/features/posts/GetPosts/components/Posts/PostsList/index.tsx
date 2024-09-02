import Alert from "@mui/material/Alert";
import List from "@mui/material/List";

import Post from "./Post";
import PostsPagination from "./PostsPagination";
import type { PostsData, PostsView } from "@features/posts/GetPosts/types";

interface PostsListProps {
  postsData: PostsData;
  postsView: PostsView;
  toolbar: React.ReactElement;
  postCover: React.ReactElement;
}

const PostsList = (props: PostsListProps) => {
  const { postsView, toolbar, postCover, postsData } = props;

  if (postsData.posts.length === 0) {
    return (
      <Alert severity="info" role="status" sx={{ mt: 10 }}>
        No posts found
      </Alert>
    );
  }

  return (
    <>
      {toolbar}
      <List
        disablePadding
        sx={{
          ...(postsView === "grid" && {
            display: "grid",
            gridTemplateColumns: {
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            },
            columnGap: 2.5,
            rowGap: 7,
          }),
        }}
      >
        {postsData.posts.map(({ id, ...post }) => (
          <Post
            key={id}
            {...post}
            postCover={postCover}
            postsView={postsView}
          />
        ))}
      </List>
      <PostsPagination {...postsData.pageData} />
    </>
  );
};

export default PostsList;
