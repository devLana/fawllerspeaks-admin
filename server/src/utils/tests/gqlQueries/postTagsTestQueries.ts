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

      ... on CreatedPostTagsWarning {
        tags {
          __typename
          ...postTagFields
        }
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
  mutation DeletePostTags($tagIds: [ID!]!) {
    deletePostTags(tagIds: $tagIds) {
      ... on DeletedPostTags {
        __typename
        tagIds
        status
      }

      ... on DeletedPostTagsWarning {
        tagIds
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

      ... on EditedPostTagWarning {
        __typename
        tag {
          __typename
          ...postTagFields
        }
        message
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

      ... on BaseResponse {
        __typename
        message
        status
      }
    }
  }
`;
