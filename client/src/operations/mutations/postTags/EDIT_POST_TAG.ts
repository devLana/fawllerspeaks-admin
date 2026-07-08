import { gql, type TypedDocumentNode as Node } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/postTags/postTag";
import type { MutationEditPostTagArgs } from "@appTypes/graphql";
import type { EditPostTagData } from "@appTypes/postTags/editPostTag";

type EditPostTag = Node<EditPostTagData, MutationEditPostTagArgs>;

export const EDIT_POST_TAG: EditPostTag = gql`
  ${POST_TAG_FIELDS}
  mutation EditPostTag($tagId: ID!, $name: String!) {
    editPostTag(tagId: $tagId, name: $name) {
      ... on EditPostTagValidationError {
        tagIdError
        nameError
      }
      ... on BaseResponse {
        __typename
      }
      ... on NotFoundError {
        message
      }
      ... on ForbiddenError {
        message
      }
      ... on EditedPostTagWarning {
        message
        tag {
          ...PostTagFields
        }
      }
      ... on EditedPostTag {
        tag {
          ...PostTagFields
        }
      }
    }
  }
`;
