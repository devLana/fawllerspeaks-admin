import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/POST_TAG";
import type { QueryGetPostArgs } from "@apiTypes";
import type { GetPostToEditData } from "types/posts/editPost";

type GetPostToEdit = TypedDocumentNode<GetPostToEditData, QueryGetPostArgs>;

export const GET_POST_TO_EDIT: GetPostToEdit = gql`
  ${POST_TAG_FIELDS}
  query GetPostToEdit($slug: String!) {
    getPost(slug: $slug) {
      ... on BaseResponse {
        __typename
      }
      ... on UnknownError {
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
            html
          }
          url {
            slug
          }
          imageBanner
          tags {
            ...PostTagFields
          }
          status
        }
      }
    }
  }
`;
