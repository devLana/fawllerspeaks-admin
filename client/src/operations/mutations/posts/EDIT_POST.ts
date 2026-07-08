import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_FIELDS } from "@fragments/posts/post";
import type { MutationEditPostArgs } from "@appTypes/graphql";
import type { EditPostData } from "@appTypes/posts/editPost";

type EditPost = TypedDocumentNode<EditPostData, MutationEditPostArgs>;

export const EDIT_POST: EditPost = gql`
  ${POST_FIELDS}
  mutation EditPost($post: EditPostInput!) {
    editPost(post: $post) {
      ... on EditPostValidationError {
        idError
        titleError
        descriptionError
        excerptError
        contentError
        tagIdsError
        imageBannerError
        editStatusError
      }
      ... on BaseResponse {
        __typename
      }
      ... on NotFoundError {
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
