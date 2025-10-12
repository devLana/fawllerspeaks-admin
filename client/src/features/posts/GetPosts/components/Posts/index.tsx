import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

// import usePostsLoadingState from "@hooks/getPosts/usePostsLoadingState";
import { usePostsFilters } from "@hooks/getPosts/usePostsFilters";
import PostsWrapper from "../PostsWrapper";
import PostStatusInput from "./PostsMenuInputs/PostStatusInput";
import SortByInput from "./PostsMenuInputs/SortByInput";
import Searchbox from "./PostsMenuInputs/Searchbox";
import PageSizeInput from "./PostsMenuInputs/PageSizeInput";
import PostsList from "./PostsList";
import type { PostsPageData } from "types/posts/getPosts";

interface PostsProps {
  id: string;
  isLoadingMore?: boolean;
  postsData: PostsPageData;
}

const Posts = ({ id, isLoadingMore = false, postsData }: PostsProps) => {
  // const isLoading = usePostsLoadingState(isLoadingMore);
  const { queryParams } = usePostsFilters();
  const { status, sort } = queryParams;

  let pageKey = "date";

  if (sort && status) {
    pageKey = `${sort.startsWith("date") ? "date" : "title"}-${status}`;
  } else if (sort) {
    pageKey = sort.startsWith("date") ? "date" : "title";
  } else if (status) {
    pageKey = `${status}-date`;
  }

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
        <PageSizeInput />
        <PostStatusInput />
        <SortByInput />
        <Searchbox />
      </Box>
      {postsData.posts.length === 0 ? (
        <Alert severity="info" role="status">
          No posts found
        </Alert>
      ) : (
        <PostsList
          key={pageKey}
          isLoadingMore={isLoadingMore}
          postsData={postsData}
        />
      )}
    </PostsWrapper>
  );
};

export default Posts;
