import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_FIELDS } from "@fragments/POST";
import type { MutationUndoUnpublishPostArgs as Args } from "@apiTypes";
import type { UndoUnpublishPostData as Data } from "types/posts/undoUnpublishPost";

type UndoUnpublishPost = TypedDocumentNode<Data, Args>;

export const UNDO_UNPUBLISH_POST: UndoUnpublishPost = gql`
  ${POST_FIELDS}
  mutation UndoUnpublishPost($postId: ID!) {
    undoUnpublishPost(postId: $postId) {
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
