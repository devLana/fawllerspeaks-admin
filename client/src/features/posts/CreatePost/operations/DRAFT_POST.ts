import { gql, type TypedDocumentNode } from "@apollo/client";

// import { POST_FIELDS } from "@fragments/Post";
import type { MutationDraftPostArgs } from "@apiTypes";
import type { DraftPostData } from "@types";

type DraftPost = TypedDocumentNode<DraftPostData, MutationDraftPostArgs>;

// ${POST_FIELDS}
export const DRAFT_POST: DraftPost = gql`
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
        __typename
      }
    }
  }
`;
