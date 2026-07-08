import { gql, type TypedDocumentNode as Node } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/postTags/postTag";
import type { MutationCreatePostTagsArgs as Args } from "@appTypes/graphql";
import type { CreatePostTagsData } from "@appTypes/postTags/createPostTags";

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
      ... on ForbiddenError {
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
