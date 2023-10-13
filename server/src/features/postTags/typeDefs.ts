export const postTagsTypeDefs = `#graphql
  type PostTag {
    id: ID!
    name: String!
    dateCreated: String!
    lastModified: String
  }

  type PostTags {
    tags: [PostTag!]!
    status: Status!
  }

  type PostTagsWarning implements BaseResponse {
    tags: [PostTag!]!
    message: String!
    status: Status!
  }

  type EditedPostTag {
    tag: PostTag!
    status: Status!
  }

  type CreatePostTagsValidationError {
    tagsError: String!
    status: Status!
  }

  type DeletePostTagsValidationError {
    tagIdsError: String!
    status: Status!
  }

  type EditPostTagValidationError {
    tagIdError: String
    nameError: String
    status: Status!
  }

  type DuplicatePostTagError implements BaseResponse {
    message: String!
    status: Status!
  }

  union CreatePostTags = PostTags | PostTagsWarning | CreatePostTagsValidationError | DuplicatePostTagError | UnknownError | AuthenticationError | RegistrationError

  union DeletePostTags = PostTags | PostTagsWarning | DeletePostTagsValidationError | NotAllowedError | UnknownError

  union EditPostTag = EditedPostTag | EditPostTagValidationError | DuplicatePostTagError | NotAllowedError | UnknownError

  union GetPostTags = PostTags | NotAllowedError
`;
