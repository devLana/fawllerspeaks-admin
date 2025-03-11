import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";

import { usePostsFilters } from "@hooks/getPosts/usePostsFilters";
import RootLayout from "@layouts/RootLayout";
import Posts from "@features/posts/GetPosts/components/Posts";
import PostsLoading from "@features/posts/GetPosts/components/PostsLoading";
import PostsTextContent from "@features/posts/GetPosts/components/PostsTextContent";
import NoPostsData from "@features/posts/GetPosts/components/NoPostsData";
import { GET_POSTS } from "@queries/getPosts/GET_POSTS";
import { SESSION_ID } from "@utils/constants";
import uiLayout from "@utils/layouts/uiLayout";
import type { NextPageWithLayout } from "@types";

const GetPosts: NextPageWithLayout = () => {
  const { replace, asPath, isReady } = useRouter();
  const { gqlVariables } = usePostsFilters();

  const { data, error, client, loading, previousData } = useQuery(GET_POSTS, {
    variables: gqlVariables,
    skip: !isReady,
  });

  const id = "blog-posts";
  const msg1 = "Invalid posts search filters provided";
  const msg2 = `You are unable to get posts at the moment. Please try again later`;

  if ((!isReady || loading) && !previousData) return <PostsLoading id={id} />;

  if (error) {
    const message = error.graphQLErrors?.[0]?.message ?? msg2;
    return <PostsTextContent severity="error" id={id} node={message} />;
  }

  if (loading && previousData?.getPosts.__typename === "GetPostsData") {
    return <Posts id={id} postsData={previousData.getPosts} />;
  }

  if (!data) return <PostsTextContent id={id} node={<NoPostsData />} />;

  switch (data.getPosts.__typename) {
    case "AuthenticationError": {
      const query = { status: "unauthenticated", redirectTo: asPath };

      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace({ pathname: "/login", query });
      return <PostsLoading id={id} />;
    }

    case "NotAllowedError":
      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace({ pathname: "/login", query: { status: "unauthorized" } });
      return <PostsLoading id={id} />;

    case "RegistrationError": {
      const query = { status: "unregistered", redirectTo: asPath };

      void replace({ pathname: "/register", query });
      return <PostsLoading id={id} />;
    }

    case "ForbiddenError":
      return <PostsTextContent id={id} node={data.getPosts.message} />;

    case "GetPostsValidationError":
      return (
        <PostsTextContent
          severity="error"
          id={id}
          node={data.getPosts.cursorError || msg1}
        />
      );

    case "GetPostsData":
      return <Posts id={id} postsData={data.getPosts} />;

    default:
      return <PostsTextContent id={id} node={msg2} />;
  }
};

GetPosts.layout = uiLayout(RootLayout, { title: "Blog Posts" });

export default GetPosts;
