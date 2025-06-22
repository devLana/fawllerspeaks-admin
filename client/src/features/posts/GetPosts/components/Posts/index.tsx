import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

// import usePostsLoadingState from "@hooks/getPosts/usePostsLoadingState";
import PostsWrapper from "../PostsWrapper";
import PostStatusInput from "./PostsMenuInputs/PostStatusInput";
import SortByInput from "./PostsMenuInputs/SortByInput";
import Searchbox from "./PostsMenuInputs/Searchbox";
import PostsList from "./PostsList";
import type { PostsPageData } from "types/posts/getPosts";

interface PostsProps {
  id: string;
  isLoadingMore?: boolean;
  postsData: PostsPageData;
}

const Posts = ({ id, isLoadingMore = false, postsData }: PostsProps) => {
  // const isLoading = usePostsLoadingState(isLoadingMore);

  return (
    <PostsWrapper id={id} ariaBusy={false}>
      <Box
        sx={{
          mb: 5,
          display: "grid",
          gap: 4,
          gridTemplateColumns: {
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            lg: "repeat(auto-fit, minmax(140px, auto))",
          },
        }}
      >
        <PostStatusInput />
        <SortByInput />
        <Searchbox />
      </Box>
      {postsData.posts.length === 0 ? (
        <Alert severity="info" role="status">
          No posts found
        </Alert>
      ) : (
        <PostsList isLoadingMore={isLoadingMore} postsData={postsData} />
      )}
    </PostsWrapper>
  );
};

export default Posts;
