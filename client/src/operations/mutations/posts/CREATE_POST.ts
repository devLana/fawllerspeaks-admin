import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_FIELDS } from "@fragments/posts/post";
import type { MutationCreatePostArgs } from "@appTypes/graphql";
import type { CreatePostGQLData } from "@appTypes/posts/createPost";

type CreatePost = TypedDocumentNode<CreatePostGQLData, MutationCreatePostArgs>;

export const CREATE_POST: CreatePost = gql`
  ${POST_FIELDS}
  mutation CreatePost($post: CreatePostInput!) {
    createPost(post: $post) {
      ... on PostValidationError {
        titleError
        descriptionError
        excerptError
        contentError
        tagIdsError
        imageBannerError
      }
      ... on BaseResponse {
        __typename
      }
      ... on SinglePost {
        post {
          ...PostFields
        }
      }
    }
  }
`;
