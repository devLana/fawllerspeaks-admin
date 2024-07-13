// import { useRouter } from "next/router";

// import { useQuery } from "@apollo/client";

import RootLayout from "@layouts/RootLayout";
// import NextLink from "@components/NextLink";
import Posts from "@features/posts/GetPosts/components/Posts";
// import PostsLoading from "@features/posts/GetPosts/components/PostsLoading";
// import PostsTextContent from "@features/posts/GetPosts/components/PostsTextContent";
// import { GET_POSTS } from "@features/posts/GetPosts/operations/GET_POSTS";
// import { SESSION_ID } from "@utils/constants";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";

const GetPosts: NextPageWithLayout = () => {
  // const { replace, pathname } = useRouter();

  // const { data, error, loading, client } = useQuery(GET_POSTS);

  const id = "blog-posts";

  // const msg =
  //   "You are unable to get posts at the moment. Please try again later";

  // if (loading) return <PostsLoading id={id} />;

  // if (error) {
  //   const message = error.graphQLErrors[0]?.message ?? msg;
  //   return <PostsTextContent severity="error" id={id} text={message} />;
  // }

  // if (!data) {
  //   const text = (
  //     <>
  //       No posts found. Go to&nbsp;
  //       <NextLink href="/posts/new">Create New Posts</NextLink> to get started
  //     </>
  //   );

  //   return <PostsTextContent id={id} text={text} />;
  // }

  // switch (data.getPosts.__typename) {
  //   case "NotAllowedError":
  //     localStorage.removeItem(SESSION_ID);
  //     void client.clearStore();
  //     void replace(`/login?status=unauthenticated&redirectTo=${pathname}`);
  //     return <PostsLoading id={id} />;

  //   case "Posts":
  //     if (data.getPosts.posts.length === 0) {
  //       const text = (
  //         <>
  //           No posts have been created yet. Go to{" "}
  //           <NextLink href="/posts/new">Create New Posts</NextLink> to get
  //           started
  //         </>
  //       );

  //       return <PostsTextContent id={id} text={text} />;
  //     }

  return <Posts id={id} />;

  //   default:
  //     return <PostsTextContent id={id} text={msg} />;
  // }
};

GetPosts.layout = uiLayout(RootLayout, { title: "Blog Posts" });

export default GetPosts;
