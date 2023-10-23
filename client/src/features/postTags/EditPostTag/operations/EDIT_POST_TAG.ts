import { gql, type TypedDocumentNode as Node } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/PostTag";
import type { Mutation, MutationEditPostTagArgs } from "@apiTypes";

type EditPostTagData = Pick<Mutation, "editPostTag">;
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
      ... on UnknownError {
        message
      }
      ... on DuplicatePostTagError {
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
