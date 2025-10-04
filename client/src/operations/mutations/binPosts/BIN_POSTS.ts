import { gql, type TypedDocumentNode } from "@apollo/client";

import { BIN_POST_FIELDS } from "@fragments/BIN_POST";
import type { MutationBinPostsArgs } from "@apiTypes";
import type { BinPostsData } from "types/posts/bin/binPosts";

type BinPosts = TypedDocumentNode<BinPostsData, MutationBinPostsArgs>;

export const BIN_POSTS: BinPosts = gql`
  ${BIN_POST_FIELDS}
  mutation BinPosts($postIds: [ID!]!) {
    binPosts(postIds: $postIds) {
      ... on PostIdsValidationError {
        postIdsError
      }
      ... on BaseResponse {
        __typename
      }
      ... on UnknownError {
        message
      }
      ... on PostsWarning {
        message
        posts {
          ...BinPostFields
        }
      }
      ... on Posts {
        posts {
          ...BinPostFields
        }
      }
    }
  }
`;
