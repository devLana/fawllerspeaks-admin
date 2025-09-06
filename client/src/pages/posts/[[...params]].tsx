import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";

import { usePostsFilters } from "@hooks/getPosts/usePostsFilters";
import RootLayout from "@layouts/RootLayout";
import Posts from "@features/posts/GetPosts/components/Posts";
import PostsLoading from "@features/posts/GetPosts/components/PostsLoading";
import PostsTextContent from "@features/posts/GetPosts/components/PostsTextContent";
import NoPostsData from "@features/posts/GetPosts/components/NoPostsData";
import GetPostsApiValidationErrors from "@features/posts/GetPosts/components/GetPostsAPIValidationErrors";
import FilterParamsErrors from "@features/posts/GetPosts/components/FilterParamsErrors";
import { GET_POSTS } from "@queries/getPosts/GET_POSTS";
import { SESSION_ID } from "@utils/constants";
import uiLayout from "@utils/layouts/uiLayout";
import type { NextPageWithLayout } from "@types";

const GetPosts: NextPageWithLayout = () => {
  const { replace, asPath, isReady } = useRouter();
  const { gqlVariables, paramsErrors } = usePostsFilters();

  const { data, error, client, loading, previousData } = useQuery(GET_POSTS, {
    variables: gqlVariables,
    skip: !isReady || !!paramsErrors,
  });

  const id = "blog-posts";
  const msg1 = `It appears we could not find what you are looking for. Please try again later`;
  const msg2 = `You are unable to get posts at the moment. Please try again later`;

  if (paramsErrors) {
    const node = <FilterParamsErrors paramsErrors={paramsErrors} />;
    return <PostsTextContent id={id} node={node} />;
  }

  if ((!isReady || loading) && !previousData) return <PostsLoading id={id} />;

  if (loading && previousData?.getPosts.__typename === "GetPostsData") {
    return <Posts id={id} postsData={previousData.getPosts} isLoadingMore />;
  }

  if (error) {
    const message = error.graphQLErrors?.[0] ? msg1 : msg2;
    return <PostsTextContent severity="error" id={id} node={message} />;
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

    case "GetPostsValidationError": {
      const { __typename, ...errors } = data.getPosts;
      const node = <GetPostsApiValidationErrors {...errors} />;
      return <PostsTextContent severity="error" id={id} node={node} />;
    }

    case "GetPostsData":
      return <Posts id={id} postsData={data.getPosts} />;

    default:
      return <PostsTextContent id={id} node={msg2} />;
  }
};

GetPosts.layout = uiLayout(RootLayout, { title: "Blog Posts" });

export default GetPosts;
