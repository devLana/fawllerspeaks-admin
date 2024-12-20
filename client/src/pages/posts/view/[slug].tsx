import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";

import RootLayout from "@layouts/RootLayout";
import Post from "@features/posts/ViewPost/Post";
import GetPost from "@features/posts/components/GetPost";
import uiLayout from "@utils/layouts/uiLayout";
import { GET_POST } from "@queries/viewPost/GET_POST";
import type { NextPageWithLayout } from "@types";

const ViewPost: NextPageWithLayout = () => {
  const { query, isReady } = useRouter();

  const { data, error, loading } = useQuery(GET_POST, {
    variables: { slug: query.slug as string },
    skip: !isReady,
  });

  return (
    <GetPost
      data={data}
      error={error}
      loading={loading}
      label="View post page"
      msg="You are unable to view this post at the moment. Please try again later"
    >
      {post => <Post label="View post page" post={post} />}
    </GetPost>
  );
};

ViewPost.layout = uiLayout(RootLayout, { title: "View Post" });

export default ViewPost;
