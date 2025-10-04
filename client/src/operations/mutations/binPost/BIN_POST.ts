import { gql, type TypedDocumentNode } from "@apollo/client";

import { BIN_POST_FIELDS } from "@fragments/BIN_POST";
import type { MutationBinPostArgs } from "@apiTypes";
import type { BinPostData } from "types/posts/bin/binPost";

type BinPost = TypedDocumentNode<BinPostData, MutationBinPostArgs>;

export const BIN_POST: BinPost = gql`
  ${BIN_POST_FIELDS}
  mutation BinPost($postId: ID!) {
    binPost(postId: $postId) {
      ... on PostIdValidationError {
        postIdError
      }
      ... on BaseResponse {
        __typename
      }
      ... on NotAllowedPostActionError {
        message
      }
      ... on UnknownError {
        message
      }
      ... on SinglePost {
        post {
          ...BinPostFields
        }
      }
    }
  }
`;
