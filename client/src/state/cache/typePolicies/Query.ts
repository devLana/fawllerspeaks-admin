import type { TypePolicy } from "@apollo/client";

export const Query: TypePolicy = {
  fields: {
    getPost(_, { args, toReference }) {
      const postRef = toReference({
        __typename: "Post",
        url: { slug: args?.slug as string },
      });

      return { __typename: "SinglePost", post: postRef };
    },
  },
};
