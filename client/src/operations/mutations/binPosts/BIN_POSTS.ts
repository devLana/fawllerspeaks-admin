import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_FIELDS } from "@fragments/POST";
import type { MutationBinPostsArgs } from "@apiTypes";
import type { BinPostsData } from "types/posts/binPosts";

type BinPosts = TypedDocumentNode<BinPostsData, MutationBinPostsArgs>;

export const BIN_POSTS: BinPosts = gql`
  ${POST_FIELDS}
  mutation BinPosts($postIds: [ID!]!) {
    binPosts(postIds: $postIds) {
      ... on PostIdsValidationError {
        postIdsError
      }
      ... on BaseResponse {
        __typename
      }
      ... on PostsWarning {
        message
        posts {
          ...PostFields
        }
      }
      ... on Posts {
        posts {
          ...PostFields
        }
      }
    }
  }
`;
