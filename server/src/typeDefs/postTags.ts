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

  union CreatePostTags = PostTags | CreatedPostTagsWarning | CreatePostTagsValidationError | ForbiddenError | UnauthorizedError | RegistrationError

  union DeletePostTags = DeletedPostTags | DeletedPostTagsWarning | DeletePostTagsValidationError | NotFoundError | UnauthorizedError | RegistrationError

  union EditPostTag = EditedPostTag | EditedPostTagWarning | EditPostTagValidationError | UnauthorizedError | RegistrationError | ForbiddenError | NotFoundError

  union GetPostTags = PostTags | UnauthorizedError | RegistrationError
`;
