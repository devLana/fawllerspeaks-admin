export const postsTypeDefs = `#graphql
  type Post {
    id: ID!
    title: String!
    description: String
    content: String
    author: String!
    status: PostStatus!
    slug: String
    url: String!
    imageBanner: String
    dateCreated: String!
    datePublished: String
    lastModified: String
    views: Int!
    likes: Int!
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

  type PostValidationError {
    postIdError: String
    titleError: String
    descriptionError: String
    contentError: String
    tagsError: String
    slugError: String
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

  type CreatePostValidationError {
    titleError: String
    descriptionError: String
    contentError: String
    tagsError: String
    slugError: String
    status: Status!
  }

  union Bin_UnBin_Delete = Posts | PostsWarning | PostIdsValidationError | UnauthorizedAuthorError | NotAllowedError | UnknownError

  union CreatePost = SinglePost | CreatePostValidationError | DuplicatePostTitleError | NotAllowedError | UnknownError

  union Draft_Edit = SinglePost | PostValidationError | DuplicatePostTitleError | UnauthorizedAuthorError | NotAllowedPostActionError | NotAllowedError | UnknownError

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
    content: String!
    tags: [ID!]
    slug: String
  }

  input DraftPostInput {
    postId: ID
    title: String!
    description: String
    content: String
    tags: [ID!]
    slug: String
  }

  input EditPostInput {
    postId: ID!
    title: String!
    description: String!
    content: String!
    tags: [ID!]
    slug: String
  }
`;
