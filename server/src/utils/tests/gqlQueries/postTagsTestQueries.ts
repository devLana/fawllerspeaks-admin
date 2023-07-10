const POST_TAG_FIELDS = `#graphql
  fragment postTagFields on PostTag {
    id
    name
    dateCreated
    lastModified
  }
`;

export const CREATE_POST_TAGS = `#graphql
  ${POST_TAG_FIELDS}
  mutation CreatePostTags($tags: [String!]!) {
    createPostTags(tags: $tags) {
      ... on PostTags {
        __typename
        tags {
          __typename
          ...postTagFields
        }
        status
      }

      ... on PostTagsWarning {
        __typename
        tags {
          __typename
          ...postTagFields
        }
        message
        status
      }

      ... on CreatePostTagsValidationError {
        __typename
        tagsError
        status
      }

      ... on BaseResponse {
        __typename
        message
        status
      }
    }
  }
`;

export const DELETE_POST_TAGS = `#graphql
  ${POST_TAG_FIELDS}
  mutation DeletePostTags($tagIds: [ID!]!) {
    deletePostTags(tagIds: $tagIds) {
      ... on PostTags {
        __typename
        tags {
          __typename
          ...postTagFields
        }
        status
      }

      ... on PostTagsWarning {
        __typename
        tags {
          __typename
          ...postTagFields
        }
      }

      ... on DeletePostTagsValidationError {
        __typename
        tagIdsError
        status
      }

      ... on BaseResponse {
        __typename
        message
        status
      }
    }
  }
`;

export const EDIT_POST_TAG = `#graphql
  ${POST_TAG_FIELDS}
  mutation EditPostTag($tagId: ID!, $name: String!) {
    editPostTag(tagId: $tagId, name: $name) {
      ... on EditedPostTag {
        __typename
        tag {
          __typename
          ...postTagFields
        }
        status
      }

      ... on EditPostTagValidationError {
        __typename
        tagIdError
        nameError
        status
      }

      ... on BaseResponse {
        __typename
        message
        status
      }
    }
  }
`;

export const GET_POST_TAGS = `#graphql
  ${POST_TAG_FIELDS}
  {
    getPostTags {
      ... on PostTags {
        __typename
        tags {
          __typename
          ...postTagFields
        }
        status
      }

      ... on NotAllowedError {
        __typename
        message
        status
      }
    }
  }
`;
