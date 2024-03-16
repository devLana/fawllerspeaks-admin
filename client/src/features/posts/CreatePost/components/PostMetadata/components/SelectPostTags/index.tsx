import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";

import useGetPostTags from "@hooks/useGetPostTags";
import SelectPostTagsInput from "./SelectPostTagsInput";
import { SESSION_ID } from "@utils/constants";

interface SelectPostTagsProps {
  tags?: string[];
  onSelectTags: (selectedTags: string[]) => void;
}

const SelectPostTags = ({ tags = [], onSelectTags }: SelectPostTagsProps) => {
  const { replace, pathname } = useRouter();

  const client = useApolloClient();
  const { data, error, loading } = useGetPostTags();

  const msg =
    "You can't add post tags to this post at the moment. Please try again later";

  const skeletonSx = { mt: 2, mb: 1, maxWidth: "none" };
  const alertSx = { mt: 1.25, mb: 0.25 };

  if (loading) {
    return (
      <Skeleton variant="rounded" width="100%" sx={skeletonSx}>
        <SelectPostTagsInput />
      </Skeleton>
    );
  }

  if (error) {
    const message = error.graphQLErrors[0]?.message ?? msg;
    return (
      <Alert severity="error" sx={alertSx}>
        {message}
      </Alert>
    );
  }

  if (!data) {
    const text =
      "No post tags found. Go to the 'Post Tags' page to create some post tags";

    return (
      <Alert severity="info" sx={alertSx}>
        {text}
      </Alert>
    );
  }

  switch (data.getPostTags.__typename) {
    case "AuthenticationError":
      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace(`/login?status=unauthenticated&redirectTo=${pathname}`);

      return (
        <Skeleton variant="rounded" width="100%" sx={skeletonSx}>
          <SelectPostTagsInput />
        </Skeleton>
      );

    case "UnknownError":
      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace("/login?status=unauthorized");

      return (
        <Skeleton variant="rounded" width="100%" sx={skeletonSx}>
          <SelectPostTagsInput />
        </Skeleton>
      );

    case "RegistrationError":
      void replace(`/register?status=unregistered&redirectTo=${pathname}`);

      return (
        <Skeleton variant="rounded" width="100%" sx={skeletonSx}>
          <SelectPostTagsInput />
        </Skeleton>
      );

    case "PostTags":
      if (data.getPostTags.tags.length === 0) {
        const text =
          "No post tags have been created yet. Go to the 'Post Tags' page to get started";

        return (
          <Alert severity="info" sx={alertSx}>
            {text}
          </Alert>
        );
      }

      return (
        <SelectPostTagsInput tags={tags} onSelectTags={onSelectTags} margin />
      );

    default:
      return (
        <Alert severity="info" sx={alertSx}>
          {msg}
        </Alert>
      );
  }
};

export default SelectPostTags;
