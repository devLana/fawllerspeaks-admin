/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AccessToken = {
  __typename?: 'AccessToken';
  accessToken: Scalars['String'];
  status: Status;
};

export type AuthCookieError = BaseResponse & {
  __typename?: 'AuthCookieError';
  message: Scalars['String'];
  status: Status;
};

export type AuthenticationError = BaseResponse & {
  __typename?: 'AuthenticationError';
  message: Scalars['String'];
  status: Status;
};

export type BaseResponse = {
  message: Scalars['String'];
  status: Status;
};

export type Bin_UnBin_Delete = NotAllowedError | PostIdsValidationError | Posts | PostsWarning | UnauthorizedAuthorError | UnknownError;

export type ChangePassword = AuthenticationError | ChangePasswordValidationError | NotAllowedError | RegistrationError | Response | ServerError | UnknownError;

export type ChangePasswordValidationError = {
  __typename?: 'ChangePasswordValidationError';
  confirmNewPasswordError?: Maybe<Scalars['String']>;
  currentPasswordError?: Maybe<Scalars['String']>;
  newPasswordError?: Maybe<Scalars['String']>;
  status: Status;
};

export type CreateDraftPost = AuthenticationError | DuplicatePostTitleError | ForbiddenError | NotAllowedError | PostValidationError | RegistrationError | SinglePost;

export type CreatePostInput = {
  content: Scalars['String'];
  description: Scalars['String'];
  excerpt: Scalars['String'];
  imageBanner?: InputMaybe<Scalars['String']>;
  tagIds?: InputMaybe<Array<Scalars['ID']>>;
  title: Scalars['String'];
};

export type CreatePostTags = AuthenticationError | CreatePostTagsValidationError | CreatedPostTagsWarning | DuplicatePostTagError | PostTags | RegistrationError | UnknownError;

export type CreatePostTagsValidationError = {
  __typename?: 'CreatePostTagsValidationError';
  status: Status;
  tagsError: Scalars['String'];
};

export type CreateUser = EmailValidationError | NotAllowedError | Response | ServerError;

export type CreatedPostTagsWarning = BaseResponse & {
  __typename?: 'CreatedPostTagsWarning';
  message: Scalars['String'];
  status: Status;
  tags: Array<PostTag>;
};

export type DeletePostContentImages = AuthenticationError | DeletePostContentImagesValidationError | ForbiddenError | RegistrationError | Response | ServerError | UnknownError;

export type DeletePostContentImagesValidationError = {
  __typename?: 'DeletePostContentImagesValidationError';
  imagesError: Scalars['String'];
  status: Status;
};

export type DeletePostTags = AuthenticationError | DeletePostTagsValidationError | DeletedPostTags | DeletedPostTagsWarning | NotAllowedError | RegistrationError | UnknownError;

export type DeletePostTagsValidationError = {
  __typename?: 'DeletePostTagsValidationError';
  status: Status;
  tagIdsError: Scalars['String'];
};

export type DeletedPostTags = {
  __typename?: 'DeletedPostTags';
  status: Status;
  tagIds: Array<Scalars['String']>;
};

export type DeletedPostTagsWarning = BaseResponse & {
  __typename?: 'DeletedPostTagsWarning';
  message: Scalars['String'];
  status: Status;
  tagIds: Array<Scalars['String']>;
};

export type DraftPostInput = {
  content?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  excerpt?: InputMaybe<Scalars['String']>;
  imageBanner?: InputMaybe<Scalars['String']>;
  tagIds?: InputMaybe<Array<Scalars['ID']>>;
  title: Scalars['String'];
};

export type DuplicatePostTagError = BaseResponse & {
  __typename?: 'DuplicatePostTagError';
  message: Scalars['String'];
  status: Status;
};

export type DuplicatePostTitleError = BaseResponse & {
  __typename?: 'DuplicatePostTitleError';
  message: Scalars['String'];
  status: Status;
};

export type EditPost = DuplicatePostTitleError | EditPostValidationError | NotAllowedError | NotAllowedPostActionError | SinglePost | UnauthorizedAuthorError | UnknownError;

export type EditPostInput = {
  content: Scalars['String'];
  description: Scalars['String'];
  excerpt: Scalars['String'];
  imageBanner?: InputMaybe<Scalars['String']>;
  postId: Scalars['ID'];
  tagIds?: InputMaybe<Array<Scalars['Int']>>;
  title: Scalars['String'];
};

export type EditPostTag = AuthenticationError | DuplicatePostTagError | EditPostTagValidationError | EditedPostTag | EditedPostTagWarning | NotAllowedError | RegistrationError | UnknownError;

export type EditPostTagValidationError = {
  __typename?: 'EditPostTagValidationError';
  nameError?: Maybe<Scalars['String']>;
  status: Status;
  tagIdError?: Maybe<Scalars['String']>;
};

export type EditPostValidationError = {
  __typename?: 'EditPostValidationError';
  contentError?: Maybe<Scalars['String']>;
  descriptionError?: Maybe<Scalars['String']>;
  excerptError?: Maybe<Scalars['String']>;
  imageBannerError?: Maybe<Scalars['String']>;
  postIdError?: Maybe<Scalars['String']>;
  status: Status;
  tagIdsError?: Maybe<Scalars['String']>;
  titleError?: Maybe<Scalars['String']>;
};

export type EditProfile = AuthenticationError | EditProfileValidationError | EditedProfile | RegistrationError | UnknownError;

export type EditProfileValidationError = {
  __typename?: 'EditProfileValidationError';
  firstNameError?: Maybe<Scalars['String']>;
  imageError?: Maybe<Scalars['String']>;
  lastNameError?: Maybe<Scalars['String']>;
  status: Status;
};

export type EditedPostTag = {
  __typename?: 'EditedPostTag';
  status: Status;
  tag: PostTag;
};

export type EditedPostTagWarning = BaseResponse & {
  __typename?: 'EditedPostTagWarning';
  message: Scalars['String'];
  status: Status;
  tag: PostTag;
};

export type EditedProfile = UserData & {
  __typename?: 'EditedProfile';
  status: Status;
  user: User;
};

export type EmailValidationError = {
  __typename?: 'EmailValidationError';
  emailError: Scalars['String'];
  status: Status;
};

export type EmptyBin = EmptyBinWarning | NotAllowedError | Posts;

export type EmptyBinWarning = BaseResponse & {
  __typename?: 'EmptyBinWarning';
  message: Scalars['String'];
  status: Status;
};

export type ForbiddenError = BaseResponse & {
  __typename?: 'ForbiddenError';
  message: Scalars['String'];
  status: Status;
};

export type ForgotGeneratePassword = EmailValidationError | NotAllowedError | RegistrationError | Response | ServerError;

export type GetPost = AuthenticationError | GetPostValidationError | GetPostWarning | NotAllowedError | RegistrationError | SinglePost;

export type GetPostTags = AuthenticationError | PostTags | RegistrationError | UnknownError;

export type GetPostValidationError = {
  __typename?: 'GetPostValidationError';
  slugError: Scalars['String'];
  status: Status;
};

export type GetPostWarning = BaseResponse & {
  __typename?: 'GetPostWarning';
  message: Scalars['String'];
  status: Status;
};

export type GetPosts = AuthenticationError | ForbiddenError | GetPostsData | GetPostsValidationError | NotAllowedError | RegistrationError;

export type GetPostsData = {
  __typename?: 'GetPostsData';
  pageData: GetPostsPageData;
  posts: Array<Post>;
  status: Status;
};

export type GetPostsFiltersInput = {
  sort?: InputMaybe<SortPostsBy>;
  status?: InputMaybe<PostStatus>;
};

export type GetPostsPageData = {
  __typename?: 'GetPostsPageData';
  after?: Maybe<Scalars['ID']>;
  before?: Maybe<Scalars['ID']>;
};

export type GetPostsPageInput = {
  cursor: Scalars['ID'];
  type: GetPostsPageType;
};

export type GetPostsPageType =
  | 'after'
  | 'before';

export type GetPostsValidationError = {
  __typename?: 'GetPostsValidationError';
  cursorError?: Maybe<Scalars['String']>;
  sortError?: Maybe<Scalars['String']>;
  status: Status;
  statusError?: Maybe<Scalars['String']>;
  typeError?: Maybe<Scalars['String']>;
};

export type LoggedInUser = UserData & {
  __typename?: 'LoggedInUser';
  accessToken: Scalars['String'];
  sessionId: Scalars['ID'];
  status: Status;
  user: User;
};

export type Login = LoggedInUser | LoginValidationError | NotAllowedError;

export type LoginValidationError = {
  __typename?: 'LoginValidationError';
  emailError?: Maybe<Scalars['String']>;
  passwordError?: Maybe<Scalars['String']>;
  status: Status;
};

export type Logout = AuthenticationError | NotAllowedError | Response | SessionIdValidationError | UnknownError;

export type Mutation = {
  __typename?: 'Mutation';
  /** Move posts to bin */
  binPosts: Bin_UnBin_Delete;
  /** Change password of registered and signed in user */
  changePassword: ChangePassword;
  /** Create a new post */
  createPost: CreateDraftPost;
  /** Create a new post tag or multiple tags */
  createPostTags: CreatePostTags;
  /** Create a new user */
  createUser: CreateUser;
  /** Delete post content images from storage bucket */
  deletePostContentImages: DeletePostContentImages;
  /** Delete a post tag or multiple post tags */
  deletePostTags: DeletePostTags;
  /** Delete posts from bin */
  deletePostsFromBin: Bin_UnBin_Delete;
  /** Draft a post */
  draftPost: CreateDraftPost;
  /** Edit a created/published post */
  editPost: EditPost;
  /** Edit a post tag */
  editPostTag: EditPostTag;
  /** Edit user profile */
  editProfile: EditProfile;
  /** Empty bin(Delete all posts from bin) */
  emptyBin: EmptyBin;
  /** Verify user email and initiate reset password */
  forgotPassword: ForgotGeneratePassword;
  /** Generate new password for unregistered user */
  generatePassword: ForgotGeneratePassword;
  /** Login a user */
  login: Login;
  /** Logout a user */
  logout: Logout;
  /** Publish a post */
  publishPost: Publish_Unpublish;
  /** Refresh jwt access token */
  refreshToken: RefreshToken;
  /** Register newly created user */
  registerUser: RegisterUser;
  /** Reset password for registered user */
  resetPassword: ResetPassword;
  /** Un-bin posts from bin */
  unBinPosts: Bin_UnBin_Delete;
  /** Un-publish a post */
  unpublishPost: Publish_Unpublish;
  /** Verify password reset token */
  verifyResetToken: VerifyResetToken;
  /** Verify user session */
  verifySession: VerifySession;
};


export type MutationBinPostsArgs = {
  postIds: Array<Scalars['ID']>;
};


export type MutationChangePasswordArgs = {
  confirmNewPassword: Scalars['String'];
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationCreatePostArgs = {
  post: CreatePostInput;
};


export type MutationCreatePostTagsArgs = {
  tags: Array<Scalars['String']>;
};


export type MutationCreateUserArgs = {
  email: Scalars['String'];
};


export type MutationDeletePostContentImagesArgs = {
  images: Array<Scalars['String']>;
};


export type MutationDeletePostTagsArgs = {
  tagIds: Array<Scalars['ID']>;
};


export type MutationDeletePostsFromBinArgs = {
  postIds: Array<Scalars['ID']>;
};


export type MutationDraftPostArgs = {
  post: DraftPostInput;
};


export type MutationEditPostArgs = {
  post: EditPostInput;
};


export type MutationEditPostTagArgs = {
  name: Scalars['String'];
  tagId: Scalars['ID'];
};


export type MutationEditProfileArgs = {
  firstName: Scalars['String'];
  image?: InputMaybe<Scalars['String']>;
  lastName: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationGeneratePasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLogoutArgs = {
  sessionId: Scalars['String'];
};


export type MutationPublishPostArgs = {
  postId: Scalars['ID'];
};


export type MutationRefreshTokenArgs = {
  sessionId: Scalars['String'];
};


export type MutationRegisterUserArgs = {
  userInput: RegisterUserInput;
};


export type MutationResetPasswordArgs = {
  confirmPassword: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationUnBinPostsArgs = {
  postIds: Array<Scalars['ID']>;
};


export type MutationUnpublishPostArgs = {
  postId: Scalars['ID'];
};


export type MutationVerifyResetTokenArgs = {
  token: Scalars['String'];
};


export type MutationVerifySessionArgs = {
  sessionId: Scalars['String'];
};

export type NotAllowedError = BaseResponse & {
  __typename?: 'NotAllowedError';
  message: Scalars['String'];
  status: Status;
};

export type NotAllowedPostActionError = BaseResponse & {
  __typename?: 'NotAllowedPostActionError';
  message: Scalars['String'];
  status: Status;
};

export type Post = {
  __typename?: 'Post';
  author: PostAuthor;
  content?: Maybe<PostContent>;
  dateCreated: Scalars['String'];
  datePublished?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageBanner?: Maybe<Scalars['String']>;
  isDeleted: Scalars['Boolean'];
  isInBin: Scalars['Boolean'];
  lastModified?: Maybe<Scalars['String']>;
  status: PostStatus;
  tags?: Maybe<Array<PostTag>>;
  title: Scalars['String'];
  url: PostUrl;
  views: Scalars['Int'];
};

export type PostAuthor = {
  __typename?: 'PostAuthor';
  image?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type PostContent = {
  __typename?: 'PostContent';
  html: Scalars['String'];
  tableOfContents?: Maybe<Array<PostTableOfContents>>;
};

export type PostIdValidationError = {
  __typename?: 'PostIdValidationError';
  postIdError: Scalars['String'];
  status: Status;
};

export type PostIdsValidationError = {
  __typename?: 'PostIdsValidationError';
  postIdsError: Scalars['String'];
  status: Status;
};

export type PostStatus =
  | 'Draft'
  | 'Published'
  | 'Unpublished';

export type PostTableOfContents = {
  __typename?: 'PostTableOfContents';
  heading: Scalars['String'];
  href: Scalars['String'];
  level: Scalars['Int'];
};

export type PostTag = {
  __typename?: 'PostTag';
  dateCreated: Scalars['String'];
  id: Scalars['ID'];
  lastModified?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type PostTags = {
  __typename?: 'PostTags';
  status: Status;
  tags: Array<PostTag>;
};

export type PostUrl = {
  __typename?: 'PostUrl';
  href: Scalars['String'];
  slug: Scalars['String'];
};

export type PostValidationError = {
  __typename?: 'PostValidationError';
  contentError?: Maybe<Scalars['String']>;
  descriptionError?: Maybe<Scalars['String']>;
  excerptError?: Maybe<Scalars['String']>;
  imageBannerError?: Maybe<Scalars['String']>;
  status: Status;
  tagIdsError?: Maybe<Scalars['String']>;
  titleError?: Maybe<Scalars['String']>;
};

export type Posts = {
  __typename?: 'Posts';
  posts: Array<Post>;
  status: Status;
};

export type PostsWarning = BaseResponse & {
  __typename?: 'PostsWarning';
  message: Scalars['String'];
  posts: Array<Post>;
  status: Status;
};

export type Publish_Unpublish = NotAllowedError | NotAllowedPostActionError | PostIdValidationError | SinglePost | UnauthorizedAuthorError | UnknownError;

export type Query = {
  __typename?: 'Query';
  /** Get post by slug */
  getPost: GetPost;
  /** Get all post tags */
  getPostTags: GetPostTags;
  /** Get posts */
  getPosts: GetPosts;
};


export type QueryGetPostArgs = {
  slug: Scalars['String'];
};


export type QueryGetPostsArgs = {
  filters?: InputMaybe<GetPostsFiltersInput>;
  page?: InputMaybe<GetPostsPageInput>;
};

export type RefreshToken = AccessToken | AuthCookieError | ForbiddenError | NotAllowedError | SessionIdValidationError | UnknownError | UserSessionError;

export type RegisterUser = AuthenticationError | RegisterUserValidationError | RegisteredUser | RegistrationError | UnknownError;

export type RegisterUserInput = {
  confirmPassword: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};

export type RegisterUserValidationError = {
  __typename?: 'RegisterUserValidationError';
  confirmPasswordError?: Maybe<Scalars['String']>;
  firstNameError?: Maybe<Scalars['String']>;
  lastNameError?: Maybe<Scalars['String']>;
  passwordError?: Maybe<Scalars['String']>;
  status: Status;
};

export type RegisteredUser = UserData & {
  __typename?: 'RegisteredUser';
  status: Status;
  user: User;
};

export type RegistrationError = BaseResponse & {
  __typename?: 'RegistrationError';
  message: Scalars['String'];
  status: Status;
};

export type ResetPassword = NotAllowedError | RegistrationError | ResetPasswordValidationError | Response;

export type ResetPasswordValidationError = {
  __typename?: 'ResetPasswordValidationError';
  confirmPasswordError?: Maybe<Scalars['String']>;
  passwordError?: Maybe<Scalars['String']>;
  status: Status;
  tokenError?: Maybe<Scalars['String']>;
};

export type Response = BaseResponse & {
  __typename?: 'Response';
  message: Scalars['String'];
  status: Status;
};

export type ServerError = BaseResponse & {
  __typename?: 'ServerError';
  message: Scalars['String'];
  status: Status;
};

export type SessionIdValidationError = {
  __typename?: 'SessionIdValidationError';
  sessionIdError: Scalars['String'];
  status: Status;
};

export type SinglePost = {
  __typename?: 'SinglePost';
  post: Post;
  status: Status;
};

export type SortPostsBy =
  | 'date_asc'
  | 'date_desc'
  | 'title_asc'
  | 'title_desc';

export type Status =
  | 'ERROR'
  | 'SUCCESS'
  | 'WARN';

export type UnauthorizedAuthorError = BaseResponse & {
  __typename?: 'UnauthorizedAuthorError';
  message: Scalars['String'];
  status: Status;
};

export type UnknownError = BaseResponse & {
  __typename?: 'UnknownError';
  message: Scalars['String'];
  status: Status;
};

export type User = {
  __typename?: 'User';
  dateCreated: Scalars['String'];
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  isRegistered: Scalars['Boolean'];
  lastName?: Maybe<Scalars['String']>;
};

export type UserData = {
  status: Status;
  user: User;
};

export type UserSessionError = BaseResponse & {
  __typename?: 'UserSessionError';
  message: Scalars['String'];
  status: Status;
};

export type VerifiedResetToken = {
  __typename?: 'VerifiedResetToken';
  email: Scalars['String'];
  resetToken: Scalars['String'];
  status: Status;
};

export type VerifiedSession = UserData & {
  __typename?: 'VerifiedSession';
  accessToken: Scalars['String'];
  status: Status;
  user: User;
};

export type VerifyResetToken = NotAllowedError | RegistrationError | VerifiedResetToken | VerifyResetTokenValidationError;

export type VerifyResetTokenValidationError = {
  __typename?: 'VerifyResetTokenValidationError';
  status: Status;
  tokenError: Scalars['String'];
};

export type VerifySession = AuthCookieError | ForbiddenError | NotAllowedError | SessionIdValidationError | UnknownError | VerifiedSession;
