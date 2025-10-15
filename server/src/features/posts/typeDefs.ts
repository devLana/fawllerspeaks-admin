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

  type GetPostsPageData {
    previous: ID
    next: ID
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
    isBinned: Boolean!
    binnedAt: String
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

  type GetPostsData {
    posts: [Post!]!
    pageData: GetPostsPageData!
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

  type EditPostValidationError {
    idError: String
    titleError: String
    descriptionError: String
    excerptError: String
    contentError: String
    tagIdsError: String
    imageBannerError: String
    editStatusError: String
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

  type GetPostsValidationError {
    afterError: String
    sizeError: String
    statusError: String
    sortError: String
    status: Status! 
  }

  type GetPostValidationError {
    slugError: String!
    status: Status!
  }

  type DeletePostContentImagesValidationError {
    imagesError: String!
    status: Status!
  }

  union BinPosts = Posts | PostsWarning | PostIdsValidationError | AuthenticationError | RegistrationError | NotAllowedError | UnknownError

  union BinPost = SinglePost | PostIdValidationError | AuthenticationError | RegistrationError | NotAllowedError | UnknownError | NotAllowedPostActionError

  ##union UnBin_Delete = Posts | PostsWarning | PostIdsValidationError | NotAllowedError | UnknownError##
  
  ##union EmptyBin = Posts | EmptyBinWarning | NotAllowedError##

  union CreateDraftPost = SinglePost | PostValidationError | DuplicatePostTitleError | ForbiddenError | AuthenticationError | RegistrationError | NotAllowedError

  union EditPost = SinglePost | EditPostValidationError | AuthenticationError |  NotAllowedError | NotAllowedPostActionError | UnknownError | RegistrationError | ForbiddenError | DuplicatePostTitleError

  union GetPost = SinglePost | GetPostValidationError | AuthenticationError | NotAllowedError | RegistrationError | UnknownError

  union GetPosts = GetPostsData | GetPostsValidationError | AuthenticationError | NotAllowedError | RegistrationError | ForbiddenError

  union UnpublishUndoUnpublishPost = SinglePost | Response | PostIdValidationError | NotAllowedPostActionError | UnknownError | RegistrationError | NotAllowedError | AuthenticationError

  union DeletePostContentImages = Response | DeletePostContentImagesValidationError | AuthenticationError | ForbiddenError | RegistrationError | ServerError | UnknownError

  enum PostStatus {
    Draft
    Published
    Unpublished
  }

  enum SortPostsBy {
    date_asc
    title_asc
    date_desc
    title_desc
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
    id: ID!
    title: String!
    description: String
    excerpt: String
    content: String
    tagIds: [ID!]
    imageBanner: String
    editStatus: Boolean
  }
`;
