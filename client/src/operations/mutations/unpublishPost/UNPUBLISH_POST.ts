import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_FIELDS } from "@fragments/POST";
import type { MutationUnpublishPostArgs as Args } from "@apiTypes";
import type { UnpublishPostData as Data } from "types/posts/unpublishPost";

type UnpublishPost = TypedDocumentNode<Data, Args>;

export const UNPUBLISH_POST: UnpublishPost = gql`
  ${POST_FIELDS}
  mutation UnpublishPost($postId: ID!) {
    unpublishPost(postId: $postId) {
      ... on PostIdValidationError {
        postIdError
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
