import List from "@mui/material/List";

import useControlPlusA from "@hooks/useControlPlusA";
import useShiftPlusClickPosts from "@hooks/getPosts/useShiftPlusClickPosts";
import Post from "./Post";
import PostItemActions from "./Post/PostItemActions";
import PostsPagination from "./PostsPagination";
import PostsToolbar from "./PostsToolbar";
import ToolbarViewButtons from "./PostsToolbar/ToolbarViewButtons";
import type * as types from "types/posts/getPosts";

interface PostsListProps {
  isLoadingMore: boolean;
  isNotDeleting: boolean;
  selectedPosts: Record<string, string>;
  postsView: types.PostsView;
  postsData: types.PostsPageData;
  dispatch: React.Dispatch<types.GetPostsListAction>;
}

const PostsList = ({
  isLoadingMore,
  isNotDeleting,
  selectedPosts,
  postsView,
  postsData,
  dispatch,
}: PostsListProps) => {
  const selectedPostsIds = Object.keys(selectedPosts);
  const shiftClick = useShiftPlusClickPosts(postsData.posts, dispatch);

  useControlPlusA(isNotDeleting, () => {
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
        selectedPosts={selectedPosts}
        selectedPostsIds={selectedPostsIds}
        posts={postsData.posts}
        dispatch={dispatch}
        viewButtons={
          <ToolbarViewButtons postsView={postsView} dispatch={dispatch} />
        }
      />
      <List
        aria-label="Blog posts"
        disablePadding
        sx={{
          mb: 6,
          ...(postsView === "grid" && {
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
            isSelected={!!selectedPosts[id]}
            postsView={postsView}
            postActions={
              <PostItemActions
                id={id}
                index={index}
                title={post.title}
                status={post.status}
                slug={post.url.slug}
                isChecked={!!selectedPosts[id]}
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
