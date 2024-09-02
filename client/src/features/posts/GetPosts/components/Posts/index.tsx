import * as React from "react";

import Box from "@mui/material/Box";

import PostsWrapper from "../PostsWrapper";
import PostsList from "./PostsList";
import PostsToolbar from "./PostsList/PostsToolbar";
import ToolbarViewButtons from "./PostsList/PostsToolbar/ToolbarViewButtons";
import PostStatusInput from "./PostsMenuInputs/PostStatusInput";
import SortByInput from "./PostsMenuInputs/SortByInput";
import Searchbox from "./PostsMenuInputs/Searchbox";
import PostCover from "./PostCover";
import type { PostsData, PostsView } from "../../types";

interface PostsProps {
  postsData: PostsData;
  id: string;
  isFetchingMore: boolean;
}

const Posts = ({ id, isFetchingMore, postsData }: PostsProps) => {
  const [postsView, setPostsView] = React.useState<PostsView>("grid");

  const handleViewXs = () => {
    setPostsView(postsView === "grid" ? "list" : "grid");
  };

  return (
    <PostsWrapper id={id} ariaBusy={false}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap={4}
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
        postCover={
          <PostCover isFetchingMore={isFetchingMore} postsView={postsView} />
        }
      />
    </PostsWrapper>
  );
};

export default Posts;
