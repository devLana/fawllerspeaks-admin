import { gql, type TypedDocumentNode } from "@apollo/client";

import type { MutationBinPostArgs } from "@apiTypes";
import type { BinPostData } from "types/posts/bin/binPost";

type BinPost = TypedDocumentNode<BinPostData, MutationBinPostArgs>;

export const BIN_POST: BinPost = gql`
  fragment PostFields on Post {
    id
    url {
      slug
    }
    status
    isBinned
    binnedAt
  }
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
          ...PostFields
        }
      }
    }
  }
`;
