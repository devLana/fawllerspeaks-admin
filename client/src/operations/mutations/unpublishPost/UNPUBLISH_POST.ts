import { gql, type TypedDocumentNode } from "@apollo/client";

import { UNPUBLISH_POST_FIELDS } from "@fragments/UNPUBLISH_POST";
import type { MutationUnpublishPostArgs as Args } from "@apiTypes";
import type { UnpublishPostData as Data } from "types/posts/unpublishPost";

type UnpublishPost = TypedDocumentNode<Data, Args>;

export const UNPUBLISH_POST: UnpublishPost = gql`
  ${UNPUBLISH_POST_FIELDS}
  mutation UnpublishPost($postId: ID!) {
    unpublishPost(postId: $postId) {
      ... on PostIdValidationError {
        __typename
      }
      ... on BaseResponse {
        __typename
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
