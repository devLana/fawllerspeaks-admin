import { gql, type TypedDocumentNode as Node } from "@apollo/client";

import type { MutationDeletePostTagsArgs } from "@appTypes/graphql";
import type { DeletePostTagsData } from "@appTypes/postTags/deletePostTags";

type DeletePostTags = Node<DeletePostTagsData, MutationDeletePostTagsArgs>;

export const DELETE_POST_TAGS: DeletePostTags = gql`
  mutation DeletePostTags($tagIds: [ID!]!) {
    deletePostTags(tagIds: $tagIds) {
      ... on DeletePostTagsValidationError {
        tagIdsError
      }
      ... on BaseResponse {
        __typename
      }
      ... on NotFoundError {
        message
      }
      ... on DeletedPostTagsWarning {
        message
      }
      ... on DeletedPostTags {
        tagIds
      }
    }
  }
`;
