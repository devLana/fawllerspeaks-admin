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

  type CreatedPostTagsWarning implements BaseResponse {
    tags: [PostTag!]!
    message: String!
    status: Status!
  }

  type DeletedPostTags {
    tagIds: [String!]!
    status: Status!
  }

  type DeletedPostTagsWarning implements BaseResponse {
    tagIds: [String!]!
    message: String!
    status: Status!
  }

  type EditedPostTag {
    tag: PostTag!
    status: Status!
  }

  type EditedPostTagWarning implements BaseResponse {
    tag: PostTag!
    message: String!
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

  union CreatePostTags = PostTags | CreatedPostTagsWarning | CreatePostTagsValidationError | DuplicatePostTagError | AuthenticationError | RegistrationError

  union DeletePostTags = DeletedPostTags | DeletedPostTagsWarning | DeletePostTagsValidationError | UnknownError | AuthenticationError | RegistrationError

  union EditPostTag = EditedPostTag | EditedPostTagWarning | EditPostTagValidationError | AuthenticationError | RegistrationError | DuplicatePostTagError | UnknownError

  union GetPostTags = PostTags | AuthenticationError | RegistrationError
`;
