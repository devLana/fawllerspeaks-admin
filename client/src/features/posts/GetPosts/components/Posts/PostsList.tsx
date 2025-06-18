import * as React from "react";

import List from "@mui/material/List";

import useControlPlusA from "@hooks/useControlPlusA";
import useShiftPlusClickPosts from "@hooks/getPosts/useShiftPlusClickPosts";
import Post from "./Post";
import PostItemActions from "./Post/PostItemActions";
import PostsPagination from "./PostsPagination";
import PostsToolbar from "./PostsToolbar";
import ToolbarViewButtons from "./PostsToolbar/ToolbarViewButtons";
import { reducer, initialState } from "@reducers/getPosts";
import type * as types from "types/posts/getPosts";

interface PostsListProps {
  isLoadingMore: boolean;
  postsData: types.PostsPageData;
}

const PostsList = ({ isLoadingMore, postsData }: PostsListProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const shiftClick = useShiftPlusClickPosts(postsData.posts, dispatch);
  const selectedPostsIds = Object.keys(state.selectedPosts);

  useControlPlusA(!state.delete.open, () => {
    dispatch({
      type: "SELECT_ALL_POSTS",
      payload: {
        shouldSelectAll: selectedPostsIds.length !== postsData.posts.length,
        posts: postsData.posts,
      },
    });
  });

  return (
    <>
      <PostsToolbar
        selectedPosts={state.selectedPosts}
        selectedPostsIds={selectedPostsIds}
        posts={postsData.posts}
        dispatch={dispatch}
        viewButtons={
          <ToolbarViewButtons postsView={state.postsView} dispatch={dispatch} />
        }
      />
      <List
        aria-label="Blog posts"
        disablePadding
        sx={{
          mb: 6,
          ...(state.postsView === "grid" && {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            columnGap: 2.5,
            rowGap: 7,
          }),
        }}
      >
        {postsData.posts.map(({ id, ...post }, index) => (
          <Post
            key={id}
            {...post}
            isLoadingMore={isLoadingMore}
            isSelected={!!state.selectedPosts[id]}
            postsView={state.postsView}
            postActions={
              <PostItemActions
                id={id}
                index={index}
                title={post.title}
                status={post.status}
                slug={post.url.slug}
                isChecked={!!state.selectedPosts[id]}
                isLoadingMore={isLoadingMore}
                {...shiftClick}
                dispatch={dispatch}
              />
            }
          />
        ))}
      </List>
      <PostsPagination {...postsData.pageData} />
    </>
  );
};

export default PostsList;
