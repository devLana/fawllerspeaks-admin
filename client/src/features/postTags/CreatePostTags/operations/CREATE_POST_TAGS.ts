import { gql, type TypedDocumentNode as Node } from "@apollo/client";

import { POST_TAG_FIELDS } from "@fragments/PostTag";
import type { Mutation, MutationCreatePostTagsArgs as Args } from "@apiTypes";

type CreatePostTagsData = Pick<Mutation, "createPostTags">;
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
      ... on PostTagsWarning {
        message
        tags {
          ...PostTagFields
        }
      }
    }
  }
`;