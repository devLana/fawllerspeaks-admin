import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client";
import Alert from "@mui/material/Alert";

import useGetPostTags from "@hooks/getPostTags/useGetPostTags";
import SelectPostTagsSkeleton from "./SelectPostTagsSkeleton";
import { SESSION_ID } from "@utils/constants";

const SelectPostTags = ({ children }: { children: React.ReactElement }) => {
  const { replace, pathname } = useRouter();

  const client = useApolloClient();
  const { data, error, loading } = useGetPostTags();

  const msg =
    "You can't add post tags to this post at the moment. Please try again later";

  if (loading) return <SelectPostTagsSkeleton />;

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
    case "AuthenticationError":
      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace(`/login?status=unauthenticated&redirectTo=${pathname}`);
      return <SelectPostTagsSkeleton />;

    case "UnknownError":
      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace("/login?status=unauthorized");
      return <SelectPostTagsSkeleton />;

    case "RegistrationError":
      void replace(`/register?status=unregistered&redirectTo=${pathname}`);
      return <SelectPostTagsSkeleton />;

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

export default SelectPostTags;
