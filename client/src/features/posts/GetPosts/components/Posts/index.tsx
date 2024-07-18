import * as React from "react";

import PostsWrapper from "../PostsWrapper";
import PostsMenu from "./PostsMenu";
import PostsToolbar from "./PostsList/PostsToolbar";
import PostsList from "./PostsList";
import ToolbarViewButtons from "./PostsList/PostsToolbar/ToolbarViewButtons";
import type { PostsView } from "@types";

const Posts = ({ id }: { id: string }) => {
  const [postsView, setPostsView] = React.useState<PostsView>("grid");

  const handleViewXs = () => {
    setPostsView(view => {
      return view === "grid" ? "list" : "grid";
    });
  };

  return (
    <PostsWrapper id={id} ariaBusy={false}>
      <>
        <PostsMenu />
        <PostsList
          postsView={postsView}
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
      </>
    </PostsWrapper>
  );
};

export default Posts;
