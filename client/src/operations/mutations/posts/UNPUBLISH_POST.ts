import { gql, type TypedDocumentNode } from "@apollo/client";

import { UNPUBLISH_POST_FIELDS } from "@fragments/posts/unpublishPost";
import type { MutationUnpublishPostArgs as Args } from "@appTypes/graphql";
import type { UnpublishPostData as Data } from "@appTypes/posts/unpublish/unpublishPost";

type UnpublishPost = TypedDocumentNode<Data, Args>;

export const UNPUBLISH_POST: UnpublishPost = gql`
  ${UNPUBLISH_POST_FIELDS}
  mutation UnpublishPost($postId: ID!) {
    unpublishPost(postId: $postId) {
      ... on PostIdValidationError {
        postIdError
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
      ... on Response {
        message
      }
      ... on SinglePost {
        post {
          ...UnpublishPostFields
        }
      }
    }
  }
`;
