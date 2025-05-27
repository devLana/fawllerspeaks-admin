import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_FIELDS } from "@fragments/POST";
import type { MutationEditPostArgs } from "@apiTypes";
import type { EditPostData } from "types/posts/editPost";

type EditPost = TypedDocumentNode<EditPostData, MutationEditPostArgs>;

export const EDIT_POST: EditPost = gql`
  ${POST_FIELDS}
  mutation EditPost($post: EditPostInput!) {
    editPost(post: $post) {
      ... on EditPostValidationError {
        idError
        titleError
        descriptionError
        excerptError
        contentError
        tagIdsError
        imageBannerError
        editStatusError
      }
      ... on BaseResponse {
        __typename
      }
      ... on DuplicatePostTitleError {
        message
      }
      ... on ForbiddenError {
        message
      }
      ... on SinglePost {
        post {
          ...PostFields
        }
      }
    }
  }
`;
