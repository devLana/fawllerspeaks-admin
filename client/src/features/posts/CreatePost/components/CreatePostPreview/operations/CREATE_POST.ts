import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_FIELDS } from "@features/posts/gqlFragments/Post";
import type { MutationCreatePostArgs } from "@apiTypes";
import type { CreatePostGQLData } from "@features/posts/types";

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
      ... on DuplicatePostTitleError {
        message
      }
      ... on ForbiddenError {
        message
      }
      ... on SinglePost {
        post {
          ...PostFields
        }
      }
    }
  }
`;
