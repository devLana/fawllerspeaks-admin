import { gql, type TypedDocumentNode } from "@apollo/client";

import { BIN_POST_FIELDS } from "@fragments/posts/binPost";
import type { MutationBinPostArgs } from "@appTypes/graphql";
import type { BinPostData } from "@appTypes/posts/bin/binPost";

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
      ... on ForbiddenError {
        message
      }
      ... on NotFoundError {
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
