import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_FIELDS } from "@features/posts/gqlFragments/Post";
import type { QueryGetPostArgs } from "@apiTypes";
import type { GetPostData } from "@features/posts/types";

type GetPost = TypedDocumentNode<GetPostData, QueryGetPostArgs>;

export const GET_POST: GetPost = gql`
  ${POST_FIELDS}
  query GetPost($slug: String!) {
    getPost(slug: $slug) {
      ... on BaseResponse {
        __typename
      }
      ... on GetPostWarning {
        message
      }
      ... on GetPostValidationError {
        slugError
      }
      ... on SinglePost {
        post {
          ...PostFields
        }
      }
    }
  }
`;
