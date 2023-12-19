import { gql, type TypedDocumentNode as Node } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/PostTag";
import type { MutationDeletePostTagsArgs } from "@apiTypes";
import type { DeletePostTagsData } from "../types";

type DeletePostTags = Node<DeletePostTagsData, MutationDeletePostTagsArgs>;

export const DELETE_POST_TAGS: DeletePostTags = gql`
  ${POST_TAG_FIELDS}
  mutation DeletePostTags($tagIds: [ID!]!) {
    deletePostTags(tagIds: $tagIds) {
      ... on DeletePostTagsValidationError {
        tagIdsError
      }
      ... on BaseResponse {
        __typename
      }
      ... on UnknownError {
        message
      }
      ... on PostTagsWarning {
        message
      }
      ... on PostTags {
        tags {
          ...PostTagFields
        }
      }
    }
  }
`;
