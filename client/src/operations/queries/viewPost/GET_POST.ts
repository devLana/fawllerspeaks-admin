import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_FIELDS } from "@fragments/POST";
import type { QueryGetPostArgs } from "@apiTypes";
import type { ViewPostData } from "types/posts/viewPost";

type GetPost = TypedDocumentNode<ViewPostData, QueryGetPostArgs>;

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
