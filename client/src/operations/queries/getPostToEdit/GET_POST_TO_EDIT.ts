import { gql, type TypedDocumentNode } from "@apollo/client";

import type { QueryGetPostArgs } from "@apiTypes";
import type { GetPostToEditData } from "types/posts/editPost";

type GetPostToEdit = TypedDocumentNode<GetPostToEditData, QueryGetPostArgs>;

export const GET_POST_TO_EDIT: GetPostToEdit = gql`
  query GetPostToEdit($slug: String!) {
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
          id
          title
          description
          excerpt
          content {
            href
          }
          imageBanner
          tags {
            id
            name
          }
          status
        }
      }
    }
  }
`;
