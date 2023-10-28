import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";

import Tags from "./components/Tags";
import PostTagsLoading from "./components/PostTagsLoading";
import PostTagsTextContent from "./components/PostTagsTextContent";
import { GET_POST_TAGS } from "./operations/GET_POST_TAGS";

const GetPostTags = () => {
  const { replace } = useRouter();
  const { data, loading, error, client } = useQuery(GET_POST_TAGS);

  const id = "post-tags";
  const msg =
    "You are unable to get post tags at the moment. Please try again later";

  if (loading) return <PostTagsLoading id={id} />;

  if (error) {
    const message = error.graphQLErrors[0]?.message ?? msg;
    return <PostTagsTextContent severity="error" id={id} text={message} />;
  }

  if (!data) {
    const text =
      "No post tags found. Click on 'Create Post Tags' above to get started";
    return <PostTagsTextContent id={id} text={text} />;
  }

  switch (data.getPostTags.__typename) {
    case "AuthenticationError":
      void client.clearStore();
      void replace("/login?status=unauthenticated");
      return <PostTagsLoading id={id} />;

    case "UnknownError":
      void client.clearStore();
      void replace("/login?status=unauthorized");
      return <PostTagsLoading id={id} />;

    case "RegistrationError":
      void replace("/register?status=unregistered");
      return <PostTagsLoading id={id} />;

    case "PostTags":
      if (data.getPostTags.tags.length === 0) {
        const text =
          "No post tags have been created yet. Click on 'Create Post Tags' above to get started";
        return <PostTagsTextContent id={id} text={text} />;
      }

      return <Tags id={id} />;

    default:
      return <PostTagsTextContent id={id} text={msg} />;
  }
};

export default GetPostTags;
