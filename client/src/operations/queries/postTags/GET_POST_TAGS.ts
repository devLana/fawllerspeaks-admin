import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/postTags/postTag";
import type { GetPostTagsData } from "@appTypes/postTags/getPostTags";

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
