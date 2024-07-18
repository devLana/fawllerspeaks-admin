import List from "@mui/material/List";

import Post from "./Post";
import PostsPagination from "./PostsPagination";
import type { PostsView } from "@types";

interface PostsListProps {
  postsView: PostsView;
  toolbar: React.ReactElement;
}

const data = {
  posts: [
    {
      id: "id-6",
      title: "Test Post Title",
      imageBanner: "https://link-to-image.com",
      status: "Unpublished",
      dateCreated: new Date().toISOString(),
      slug: "test-post-slug",
    },
    {
      id: "id-1",
      title: "Test Post Title",
      imageBanner: null,
      status: "Draft",
      dateCreated: new Date().toISOString(),
      slug: "test-post-slug",
    },
    {
      id: "id-2",
      title: "Test Post Title",
      imageBanner: "https://link-to-image.com",
      status: "Published",
      dateCreated: new Date().toISOString(),
      slug: "test-post-slug",
    },
    {
      id: "id-3",
      title: "Test Post Title",
      imageBanner: "https://link-to-image.com",
      status: "Unpublished",
      dateCreated: new Date().toISOString(),
      slug: "test-post-slug",
    },
    {
      id: "id-4",
      title: "Test Post Title",
      imageBanner: null,
      status: "Draft",
      dateCreated: new Date().toISOString(),
      slug: "test-post-slug",
    },
    {
      id: "id-5",
      title: "Test Post Title",
      imageBanner: "https://link-to-image.com",
      status: "Published",
      dateCreated: new Date().toISOString(),
      slug: "test-post-slug",
    },
  ],
  pageData: {
    // after: null,
    after: { cursor: "kjdhguhg784yhv78ty34", hasNextPage: true },
    // before: null,
    before: { cursor: "kjdhguhg784yhv78ty34", hasPreviousPage: true },
  },
} as const;

const PostsList = ({ postsView, toolbar }: PostsListProps) => {
  return (
    <>
      {toolbar}
      <List
        sx={{
          ...(postsView === "grid" && {
            display: "grid",
            gridTemplateColumns: {
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              sm: "repeat(auto-fit, minmax(330px, 1fr))",
            },
            columnGap: 2.5,
            rowGap: 8,
          }),
        }}
      >
        {data.posts.map(({ id, ...post }) => (
          <Post key={id} {...post} postsView={postsView} />
        ))}
      </List>
      <PostsPagination {...data.pageData} />
    </>
  );
};

export default PostsList;
