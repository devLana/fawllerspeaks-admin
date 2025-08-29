import { gql, type TypedDocumentNode } from "@apollo/client";

import type { MutationUnpublishPostArgs as Args } from "@apiTypes";
import type { UnpublishPostData as Data } from "types/posts/unpublishPost";

type UnpublishPost = TypedDocumentNode<Data, Args>;

export const UNPUBLISH_POST: UnpublishPost = gql`
  mutation UnpublishPost($postId: ID!) {
    unpublishPost(postId: $postId) {
      ... on PostIdValidationError {
        __typename
      }
      ... on BaseResponse {
        __typename
      }
      ... on SinglePost {
        post {
          id
          url {
            slug
          }
          status
        }
      }
    }
  }
`;
