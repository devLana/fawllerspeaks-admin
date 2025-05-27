import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";

import RootLayout from "@layouts/RootLayout";
import EditPostTextContent from "@features/posts/EditPost/components/EditPostTextContent";
import EditPostLoading from "@features/posts/EditPost/components/EditPostLoading";
import Post from "@features/posts/EditPost/components/Post";
import { GET_POST_TO_EDIT } from "@queries/getPostToEdit/GET_POST_TO_EDIT";
import uiLayout from "@utils/layouts/uiLayout";
import { SESSION_ID } from "@utils/constants";
import type { NextPageWithLayout } from "@types";
import useGetPostTags from "@hooks/getPostTags/useGetPostTags";

const EditPost: NextPageWithLayout = () => {
  const { query, isReady, asPath, replace } = useRouter();

  const { data, error, loading, client } = useQuery(GET_POST_TO_EDIT, {
    variables: { slug: query.slug as string },
    skip: !isReady,
  });

  const { error: err, loading: load, data: tags } = useGetPostTags();

  const id = "edit-post-page";
  const msg = `You are unable to view this post at the moment. Please try again later`;

  if (!isReady || loading) return <EditPostLoading id={id} />;

  if (error) {
    const message = error.graphQLErrors?.[0]?.message ?? msg;
    return <EditPostTextContent severity="error" id={id} message={message} />;
  }

  if (!data) return <EditPostTextContent id={id} message={msg} />;

  switch (data.getPost.__typename) {
    case "AuthenticationError": {
      const q = { status: "unauthenticated", redirectTo: asPath };

      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace({ pathname: "/login", query: q });
      return <EditPostLoading id={id} />;
    }

    case "NotAllowedError":
      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace({ pathname: "/login", query: { status: "unauthorized" } });
      return <EditPostLoading id={id} />;

    case "RegistrationError": {
      const q = { status: "unregistered", redirectTo: asPath };
      void replace({ pathname: "/register", query: q });
      return <EditPostLoading id={id} />;
    }

    case "GetPostValidationError":
      return (
        <EditPostTextContent
          severity="error"
          id={id}
          message={data.getPost.slugError}
        />
      );

    case "GetPostWarning":
      return <EditPostTextContent id={id} message={data.getPost.message} />;

    case "SinglePost":
      return (
        <Post
          id={id}
          post={data.getPost.post}
          postTagsData={{ error: err, data: tags, loading: load }}
        />
      );

    default:
      return <EditPostTextContent id={id} message={msg} />;
  }
};

EditPost.layout = uiLayout(RootLayout, { title: "Edit Post" });

export default EditPost;
