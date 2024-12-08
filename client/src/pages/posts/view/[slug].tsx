import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";

import RootLayout from "@layouts/RootLayout";
import PostLoading from "@features/posts/ViewPost/PostLoading";
import PostTextContent from "@features/posts/ViewPost/PostTextContent";
import Post from "@features/posts/ViewPost/Post";
import uiLayout from "@utils/layouts/uiLayout";
import { GET_POST } from "@queries/viewPost/GET_POST";
import { SESSION_ID } from "@utils/constants";
import type { NextPageWithLayout } from "@types";

const ViewPost: NextPageWithLayout = () => {
  const { query, isReady, asPath, replace } = useRouter();

  const { data, error, loading, client } = useQuery(GET_POST, {
    variables: { slug: query.slug as string },
    skip: !isReady,
  });

  const label = "View post page";

  const msg =
    "You are unable to view this post at the moment. Please try again later";

  if (!isReady || loading) return <PostLoading label={label} />;

  if (error) {
    const message = error.graphQLErrors?.[0]?.message ?? msg;
    return <PostTextContent severity="error" label={label} node={message} />;
  }

  if (!data) {
    return <PostTextContent label={label} node={msg} />;
  }

  switch (data.getPost.__typename) {
    case "AuthenticationError": {
      const q = { status: "unauthenticated", redirectTo: asPath };

      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace({ pathname: "/login", query: q });
      return <PostLoading label={label} />;
    }

    case "NotAllowedError":
      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace({ pathname: "/login", query: { status: "unauthorized" } });
      return <PostLoading label={label} />;

    case "RegistrationError": {
      const q = { status: "unregistered", redirectTo: asPath };

      void replace({ pathname: "/register", query: q });
      return <PostLoading label={label} />;
    }

    case "GetPostValidationError":
      return (
        <PostTextContent
          severity="error"
          label={label}
          node={data.getPost.slugError}
        />
      );

    case "GetPostWarning":
      return <PostTextContent label={label} node={data.getPost.message} />;

    case "SinglePost":
      return <Post label={label} post={data.getPost.post} />;

    default:
      return <PostTextContent label={label} node={msg} />;
  }
};

ViewPost.layout = uiLayout(RootLayout, { title: "View Post" });

export default ViewPost;
