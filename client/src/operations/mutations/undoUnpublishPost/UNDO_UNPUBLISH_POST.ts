import { gql, type TypedDocumentNode } from "@apollo/client";

import type { MutationUndoUnpublishPostArgs as Args } from "@apiTypes";
import type { UndoUnpublishPostData as Data } from "types/posts/undoUnpublishPost";

type UndoUnpublishPost = TypedDocumentNode<Data, Args>;

export const UNDO_UNPUBLISH_POST: UndoUnpublishPost = gql`
  mutation UndoUnpublishPost($postId: ID!) {
    undoUnpublishPost(postId: $postId) {
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
