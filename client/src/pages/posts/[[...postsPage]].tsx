import * as React from "react";
import { useRouter } from "next/router";

import { NetworkStatus } from "@apollo/client";

import { useGetPosts } from "@features/posts/GetPosts/hooks/useGetPosts";
import useGetPostTags from "@hooks/useGetPostTags";
import RootLayout from "@layouts/RootLayout";
import Posts from "@features/posts/GetPosts/components/Posts";
import PostsLoading from "@features/posts/GetPosts/components/PostsLoading";
import PostsTextContent from "@features/posts/GetPosts/components/PostsTextContent";
import NoPostsData from "@features/posts/GetPosts/components/NoPostsData";
import { SESSION_ID } from "@utils/constants";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";

const GetPosts: NextPageWithLayout = () => {
  const { replace, pathname } = useRouter();
  const { loading: tagsIsLoading } = useGetPostTags();
  const { data, error, client, loading, networkStatus } = useGetPosts();

  const id = "blog-posts";

  const msg =
    "You are unable to get posts at the moment. Please try again later";

  if (loading || tagsIsLoading) return <PostsLoading id={id} />;

  if (error) {
    const message = error.graphQLErrors?.[0]?.message ?? msg;
    return <PostsTextContent severity="error" id={id} node={message} />;
  }

  if (!data) {
    return <PostsTextContent id={id} node={<NoPostsData />} />;
  }

  switch (data.getPosts.__typename) {
    case "AuthenticationError":
      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace(`/login?status=unauthenticated&redirectTo=${pathname}`);
      return <PostsLoading id={id} />;

    case "NotAllowedError":
      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace(`/login?status=unauthenticated&redirectTo=${pathname}`);
      return <PostsLoading id={id} />;

    case "RegistrationError":
      void replace(`/register?status=unregistered&redirectTo=${pathname}`);
      return <PostsLoading id={id} />;

    case "ForbiddenError":
      return <PostsTextContent id={id} node={data.getPosts.message} />;

    case "GetPostsValidationError":
      return (
        <PostsTextContent
          severity="error"
          id={id}
          node={
            data.getPosts.cursorError || "Invalid posts search filters provided"
          }
        />
      );

    case "GetPostsData":
      return (
        <Posts
          id={id}
          isFetchingMore={networkStatus === NetworkStatus.fetchMore}
          postsData={data.getPosts}
        />
      );

    default:
      return <PostsTextContent id={id} node={msg} />;
  }
};

GetPosts.layout = uiLayout(RootLayout, { title: "Blog Posts" });

export default GetPosts;
