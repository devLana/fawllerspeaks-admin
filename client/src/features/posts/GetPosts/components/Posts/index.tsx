import * as React from "react";

import Box from "@mui/material/Box";

import PostsWrapper from "../PostsWrapper";
import PostsList from "./PostsList";
import PostsToolbar from "./PostsList/PostsToolbar";
import ToolbarViewButtons from "./PostsList/PostsToolbar/ToolbarViewButtons";
import PostStatusInput from "./PostsMenuInputs/PostStatusInput";
import SortByInput from "./PostsMenuInputs/SortByInput";
import Searchbox from "./PostsMenuInputs/Searchbox";
import type { PostsData, PostsView } from "types/posts/getPosts";

interface PostsProps {
  postsData: PostsData;
  id: string;
}

const Posts = ({ id, postsData }: PostsProps) => {
  const [postsView, setPostsView] = React.useState<PostsView>("grid");

  const handleViewXs = () => {
    setPostsView(postsView === "grid" ? "list" : "grid");
  };

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
      <PostsList
        postsView={postsView}
        postsData={postsData}
        toolbar={
          <PostsToolbar
            onChangeCheckbox={() => {}}
            viewButtons={
              <ToolbarViewButtons
                onChangePostsViewXs={handleViewXs}
                onChangePostsViewSm={view => setPostsView(view)}
                postsView={postsView}
              />
            }
          />
        }
      />
    </PostsWrapper>
  );
};

export default Posts;
