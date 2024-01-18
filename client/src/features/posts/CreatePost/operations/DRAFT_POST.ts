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
        contentError
        tagsError
        imageBannerError
      }
      ... on BaseResponse {
        __typename
      }
      ... on DuplicatePostTitleError {
        message
      }
      ... on UnknownError {
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
