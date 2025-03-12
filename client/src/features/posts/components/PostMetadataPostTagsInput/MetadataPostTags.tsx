import { useRouter } from "next/router";

import { type ApolloError, useApolloClient } from "@apollo/client";
import Alert from "@mui/material/Alert";

import MetadataPostTagsSkeleton from "./MetadataPostTagsSkeleton";
import { SESSION_ID } from "@utils/constants";
import type { GetPostTagsData } from "types/postTags/getPostTags";

interface MetadataPostTagsProps {
  children: React.ReactElement;
  loading: boolean;
  data: GetPostTagsData | undefined;
  error: ApolloError | undefined;
}

const MetadataPostTags = (props: MetadataPostTagsProps) => {
  const { children, data, error, loading } = props;
  const { replace, pathname } = useRouter();
  const client = useApolloClient();

  const msg =
    "You can't add post tags to this post at the moment. Please try again later";

  if (loading) return <MetadataPostTagsSkeleton />;

  if (error) {
    const message = error.graphQLErrors[0]?.message ?? msg;
    return (
      <Alert severity="error" sx={{ mb: 2.5 }} role="status" aria-busy="false">
        {message}
      </Alert>
    );
  }

  if (!data) {
    const text =
      "No post tags found. Go to the 'Post Tags' page to create some post tags";

    return (
      <Alert severity="info" sx={{ mb: 2.5 }} role="status" aria-busy="false">
        {text}
      </Alert>
    );
  }

  switch (data.getPostTags.__typename) {
    case "AuthenticationError": {
      const query = { status: "unauthenticated", redirectTo: pathname };

      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace({ pathname: "/login", query });
      return <MetadataPostTagsSkeleton />;
    }

    case "UnknownError":
      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace({ pathname: "/login", query: { status: "unauthorized" } });
      return <MetadataPostTagsSkeleton />;

    case "RegistrationError": {
      const query = { status: "unregistered", redirectTo: pathname };

      void replace({ pathname: "/register", query });
      return <MetadataPostTagsSkeleton />;
    }

    case "PostTags": {
      if (data.getPostTags.tags.length === 0) {
        const text =
          "No post tags have been created yet. Go to the 'Post Tags' page to get started";

        return (
          <Alert
            severity="info"
            sx={{ mb: 2.5 }}
            role="status"
            aria-busy="false"
          >
            {text}
          </Alert>
        );
      }

      return children;
    }

    default:
      return (
        <Alert severity="info" sx={{ mb: 2.5 }} role="status" aria-busy="false">
          {msg}
        </Alert>
      );
  }
};

export default MetadataPostTags;
