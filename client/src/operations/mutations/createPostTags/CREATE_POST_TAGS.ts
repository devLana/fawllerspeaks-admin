import { gql, type TypedDocumentNode as Node } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/POST_TAG";
import type { MutationCreatePostTagsArgs as Args } from "@apiTypes";
import type { CreatePostTagsData } from "types/postTags";

type CreatePostTags = Node<CreatePostTagsData, Args>;

export const CREATE_POST_TAGS: CreatePostTags = gql`
  ${POST_TAG_FIELDS}
  mutation CreatePostTags($tags: [String!]!) {
    createPostTags(tags: $tags) {
      ... on CreatePostTagsValidationError {
        tagsError
      }
      ... on BaseResponse {
        __typename
      }
      ... on DuplicatePostTagError {
        message
      }
      ... on PostTags {
        tags {
          ...PostTagFields
        }
      }
      ... on CreatedPostTagsWarning {
        message
        tags {
          ...PostTagFields
        }
      }
    }
  }
`;
