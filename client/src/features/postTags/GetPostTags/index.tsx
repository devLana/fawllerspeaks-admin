import { useRouter } from "next/router";

import useGetPostTags from "@hooks/getPostTags/useGetPostTags";
import PostTags from "./components/PostTags";
import PostTagsLoading from "./components/PostTagsLoading";
import PostTagsTextContent from "./components/PostTagsTextContent";
import { SESSION_ID } from "@utils/constants";

const GetPostTags = ({ id }: { id: string }) => {
  const { replace, pathname } = useRouter();
  const { data, loading, error, client } = useGetPostTags();

  const msg =
    "You are unable to get post tags at the moment. Please try again later";

  if (loading) return <PostTagsLoading id={id} />;

  if (error) {
    const message = error.graphQLErrors?.[0]?.message ?? msg;
    return <PostTagsTextContent id={id} severity="error" text={message} />;
  }

  if (!data) {
    const text =
      "No post tags found. Click on 'Create Post Tags' above to get started";

    return <PostTagsTextContent id={id} text={text} />;
  }

  switch (data.getPostTags.__typename) {
    case "AuthenticationError":
      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace(`/login?status=unauthenticated&redirectTo=${pathname}`);
      return <PostTagsLoading id={id} />;

    case "UnknownError":
      localStorage.removeItem(SESSION_ID);
      void client.clearStore();
      void replace("/login?status=unauthorized");
      return <PostTagsLoading id={id} />;

    case "RegistrationError":
      void replace(`/register?status=unregistered&redirectTo=${pathname}`);
      return <PostTagsLoading id={id} />;

    case "PostTags":
      if (data.getPostTags.tags.length === 0) {
        const text =
          "No post tags have been created yet. Click on 'Create Post Tags' above to get started";

        return <PostTagsTextContent id={id} text={text} />;
      }

      return <PostTags id={id} />;

    default:
      return <PostTagsTextContent id={id} text={msg} />;
  }
};

export default GetPostTags;
