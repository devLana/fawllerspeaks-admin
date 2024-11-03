import * as React from "react";

import Box from "@mui/material/Box";

import PostsWrapper from "../PostsWrapper";
import PostsList from "./PostsList";
import PostsToolbar from "./PostsList/PostsToolbar";
import ToolbarViewButtons from "./PostsList/PostsToolbar/ToolbarViewButtons";
import PostsPagination from "./PostsList/PostsPagination";
import PostStatusInput from "./PostsMenuInputs/PostStatusInput";
import SortByInput from "./PostsMenuInputs/SortByInput";
import Searchbox from "./PostsMenuInputs/Searchbox";
import type { PostsPageData, PostsView } from "types/posts/getPosts";

const Posts = ({ id, postsData }: { id: string; postsData: PostsPageData }) => {
  const [postsView, setPostsView] = React.useState<PostsView>("grid");

  return (
    <PostsWrapper id={id} ariaBusy={false}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            lg: "repeat(auto-fit, minmax(140px, auto))",
          },
          gap: 4,
        }}
      >
        <PostStatusInput />
        <SortByInput />
        <Searchbox />
      </Box>
      <PostsToolbar
        onChangeCheckbox={() => {}}
        viewButtons={
          <ToolbarViewButtons
            postsView={postsView}
            onChangePostsViewSm={view => setPostsView(view)}
            onChangePostsViewXs={() =>
              setPostsView(postsView === "grid" ? "list" : "grid")
            }
          />
        }
      />
      <PostsList postsView={postsView} posts={postsData.posts} />
      <PostsPagination {...postsData.pageData} />
    </PostsWrapper>
  );
};

export default Posts;
