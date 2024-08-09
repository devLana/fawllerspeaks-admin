import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_FIELDS } from "@fragments/Post";
import type { MutationDraftPostArgs } from "@apiTypes";
import type { DraftPostData } from "@types";

type DraftPost = TypedDocumentNode<DraftPostData, MutationDraftPostArgs>;

export const DRAFT_POST: DraftPost = gql`
  ${POST_FIELDS}
  mutation DraftPost($post: DraftPostInput!) {
    draftPost(post: $post) {
      ... on PostValidationError {
        titleError
        descriptionError
        excerptError
        contentError
        tagIdsError
        imageBannerError
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
