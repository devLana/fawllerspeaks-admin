export const postsTypeDefs = `#graphql
  type Author {
    name: String!
    image: String
  }

  type Post {
    id: ID!
    title: String!
    description: String
    excerpt: String
    content: String
    author: Author!
    status: PostStatus!
    slug: String!
    url: String!
    imageBanner: String
    dateCreated: String!
    datePublished: String
    lastModified: String
    views: Int!
    isInBin: Boolean!
    isDeleted: Boolean!
    tags: [PostTag!]
  }

  type SinglePost {
    post: Post!
    status: Status!
  }

  type Posts {
    posts: [Post!]!
    status: Status!
  }

  type PostsWarning implements BaseResponse {
    posts: [Post!]!
    message: String!
    status: Status!
  }

  type EmptyBinWarning implements BaseResponse {
    message: String!
    status: Status!
  }

  type DuplicatePostTitleError implements BaseResponse {
    message: String!
    status: Status!
  }

  type NotAllowedPostActionError implements BaseResponse {
    message: String!
    status: Status!
  }

  type UnauthorizedAuthorError implements BaseResponse {
    message: String!
    status: Status!
  }

  type DraftPostValidationError {
    titleError: String
    descriptionError: String
    excerptError: String
    contentError: String
    tagsError: String
    imageBannerError: String
    status: Status!
  }

  type EditPostValidationError {
    postIdError: String
    titleError: String
    descriptionError: String
    excerptError: String
    contentError: String
    tagsError: String
    imageBannerError: String
    status: Status!
  }

  type PostIdValidationError {
    postIdError: String!
    status: Status!
  }

  type PostIdsValidationError {
    postIdsError: String!
    status: Status!
  }

  type PostValidationError {
    titleError: String
    descriptionError: String
    excerptError: String
    contentError: String
    tagsError: String
    imageBannerError: String
    status: Status!
  }

  union Bin_UnBin_Delete = Posts | PostsWarning | PostIdsValidationError | UnauthorizedAuthorError | NotAllowedError | UnknownError

  union CreatePost = SinglePost | PostValidationError | DuplicatePostTitleError | AuthenticationError | RegistrationError | NotAllowedError | UnknownError

  union DraftPost = SinglePost | PostValidationError | DuplicatePostTitleError | AuthenticationError | RegistrationError | NotAllowedError | UnknownError

  union EditPost = SinglePost | EditPostValidationError | DuplicatePostTitleError | UnauthorizedAuthorError | NotAllowedPostActionError | NotAllowedError | UnknownError

  union EmptyBin = Posts | EmptyBinWarning | NotAllowedError

  union GetPost = SinglePost | PostIdValidationError | NotAllowedError | UnknownError

  union GetPosts = Posts | NotAllowedError

  union Publish_Unpublish = SinglePost | PostIdValidationError | UnauthorizedAuthorError | NotAllowedPostActionError | NotAllowedError | UnknownError

  enum PostStatus {
    Draft
    Published
    Unpublished
  }

  input CreatePostInput {
    title: String!
    description: String!
    excerpt: String!
    content: String!
    tags: [ID!]
    imageBanner: String
  }

  input DraftPostInput {
    title: String!
    description: String
    excerpt: String
    content: String
    tags: [ID!]
    imageBanner: String
  }

  input EditPostInput {
    postId: ID!
    title: String!
    description: String!
    excerpt: String!
    content: String!
    tags: [ID!]
    imageBanner: String
  }
`;
