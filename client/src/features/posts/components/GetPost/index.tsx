import { useRouter } from "next/router";

import { type ApolloError, useApolloClient } from "@apollo/client";

import PostLoading from "./PostLoading";
import PostTextContent from "./PostTextContent";
import { SESSION_ID } from "@utils/constants";
import type { GetPostData } from "types/posts/getPost";

interface GetPostProps<T extends GetPostData> {
  data: T | undefined;
  error: ApolloError | undefined;
  loading: boolean;
  label: string;
  msg: string;
  children: (
    post: Extract<T["getPost"], { __typename?: "SinglePost" }>["post"]
  ) => React.ReactElement;
}

const GetPost = <T extends GetPostData>(props: GetPostProps<T>) => {
  const { data, error, label, loading, msg, children } = props;
  const { isReady, asPath, replace } = useRouter();
  const client = useApolloClient();

  if (!isReady || loading) return <PostLoading label={label} />;

  if (error) {
    const message = error.graphQLErrors?.[0]?.message ?? msg;
    return <PostTextContent severity="error" label={label} node={message} />;
  }

  if (!data) return <PostTextContent label={label} node={msg} />;

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
      return children(data.getPost.post);

    default:
      return <PostTextContent label={label} node={msg} />;
  }
};

export default GetPost;
