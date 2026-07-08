import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_FIELDS } from "@fragments/posts/post";
import type { QueryGetPostArgs } from "@appTypes/graphql";
import type { ViewPostData } from "@appTypes/posts/viewPost";

type GetPost = TypedDocumentNode<ViewPostData, QueryGetPostArgs>;

export const GET_POST: GetPost = gql`
  ${POST_FIELDS}
  query GetPost($slug: String!) {
    getPost(slug: $slug) {
      ... on BaseResponse {
        __typename
      }
      ... on NotFoundError {
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
