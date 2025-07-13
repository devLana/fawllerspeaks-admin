import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";

import RootLayout from "@layouts/RootLayout";
import Post from "@features/posts/ViewPost/components/Post";
import ViewPostLoading from "@features/posts/ViewPost/components/ViewPostLoading";
import ViewPostTextContent from "@features/posts/ViewPost/components/ViewPostTextContent";
import { GET_POST } from "@queries/viewPost/GET_POST";
import uiLayout from "@utils/layouts/uiLayout";
import { SESSION_ID } from "@utils/constants";
import type { NextPageWithLayout } from "@types";

const ViewPost: NextPageWithLayout = () => {
  const { query, isReady, asPath, replace } = useRouter();

  const { data, error, loading, client } = useQuery(GET_POST, {
    variables: { slug: query.slug as string },
    skip: !isReady,
  });

  const label = "View post page";
  const msg = `You are unable to view this post at the moment. Please try again later`;

  if (!isReady || loading) return <ViewPostLoading label={label} />;

  if (error) {
    const message = error.graphQLErrors?.[0]?.message ?? msg;
    return (
      <ViewPostTextContent severity="error" label={label} text={message} />
    );
  }

  switch (data?.getPost.__typename) {
    case "AuthenticationError": {
      const q = { status: "unauthenticated", redirectTo: asPath };

      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace({ pathname: "/login", query: q });
      return <ViewPostLoading label={label} />;
    }

    case "NotAllowedError":
      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace({ pathname: "/login", query: { status: "unauthorized" } });
      return <ViewPostLoading label={label} />;

    case "RegistrationError": {
      const q = { status: "unregistered", redirectTo: asPath };
      void replace({ pathname: "/register", query: q });
      return <ViewPostLoading label={label} />;
    }

    case "GetPostValidationError":
      return (
        <ViewPostTextContent
          severity="error"
          label={label}
          text={data.getPost.slugError}
        />
      );

    case "UnknownError":
      return <ViewPostTextContent label={label} text={data.getPost.message} />;

    case "SinglePost":
      return <Post label="View post page" post={data.getPost.post} />;

    default:
      return <ViewPostTextContent label={label} text={msg} />;
  }
};

ViewPost.layout = uiLayout(RootLayout, { title: "View Post" });

export default ViewPost;
