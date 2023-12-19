import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/PostTag";
import type { GetPostTagsData } from "../types";

type GetPostTags = TypedDocumentNode<GetPostTagsData>;

export const GET_POST_TAGS: GetPostTags = gql`
  ${POST_TAG_FIELDS}
  query GetPostTags {
    getPostTags {
      ... on BaseResponse {
        __typename
      }
      ... on PostTags {
        tags {
          ...PostTagFields
        }
      }
    }
  }
`;
