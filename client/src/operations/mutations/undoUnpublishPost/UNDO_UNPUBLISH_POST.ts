import { gql, type TypedDocumentNode } from "@apollo/client";

import { UNPUBLISH_POST_FIELDS } from "@fragments/UNPUBLISH_POST";
import type { MutationUndoUnpublishPostArgs as Args } from "@apiTypes";
import type { UndoUnpublishPostData as Data } from "types/posts/undoUnpublishPost";

type UndoUnpublishPost = TypedDocumentNode<Data, Args>;

export const UNDO_UNPUBLISH_POST: UndoUnpublishPost = gql`
  ${UNPUBLISH_POST_FIELDS}
  mutation UndoUnpublishPost($postId: ID!) {
    undoUnpublishPost(postId: $postId) {
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
