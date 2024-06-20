export const postsTypeDefs = `#graphql
  type PostAuthor {
    name: String!
    image: String
  }

  type PostUrl {
    href: String!
    slug: String!
  }

  type PostTableOfContents {
    heading: String!
    level: Int!
    href: String!
  }

  type PostContent {
    html: String!
    tableOfContents: [PostTableOfContents!]
  }

  type Post {
    id: ID!
    title: String!
    description: String
    excerpt: String
    content: PostContent
    author: PostAuthor!
    status: PostStatus!
    url: PostUrl!
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

  type EditPostValidationError {
    postIdError: String
    titleError: String
    descriptionError: String
    excerptError: String
    contentError: String
    tagIdsError: String
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
    tagIdsError: String
    imageBannerError: String
    status: Status!
  }

  union Bin_UnBin_Delete = Posts | PostsWarning | PostIdsValidationError | UnauthorizedAuthorError | NotAllowedError | UnknownError

  union CreateDraftPost = SinglePost | PostValidationError | DuplicatePostTitleError | ForbiddenError | AuthenticationError | RegistrationError | NotAllowedError | UnknownError

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
    tagIds: [ID!]
    imageBanner: String
  }

  input DraftPostInput {
    title: String!
    description: String
    excerpt: String
    content: String
    tagIds: [ID!]
    imageBanner: String
  }

  input EditPostInput {
    postId: ID!
    title: String!
    description: String!
    excerpt: String!
    content: String!
    tagIds: [ID!]
    imageBanner: String
  }
`;
