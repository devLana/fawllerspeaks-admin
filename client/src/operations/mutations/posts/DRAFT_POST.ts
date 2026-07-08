import { gql, type TypedDocumentNode } from "@apollo/client";

import { POST_FIELDS } from "@fragments/posts/post";
import type { MutationDraftPostArgs } from "@appTypes/graphql";
import type { DraftPostData } from "@appTypes/posts/createPost";

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
      ... on SinglePost {
        post {
          ...PostFields
        }
      }
    }
  }
`;
