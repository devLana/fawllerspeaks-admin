import { GraphQLResolveInfo } from 'graphql';
import { APIContext } from '.';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type ChangePassword = ChangePasswordValidationError | NotAllowedError | RegistrationError | Response | ServerError | UnknownError;

export type ChangePasswordValidationError = {
  __typename?: 'ChangePasswordValidationError';
  confirmNewPasswordError?: Maybe<Scalars['String']>;
  currentPasswordError?: Maybe<Scalars['String']>;
  newPasswordError?: Maybe<Scalars['String']>;
  status: Status;
};

export type CreatePost = CreatePostValidationError | DuplicatePostTitleError | NotAllowedError | SinglePost | UnknownError;

export type CreatePostInput = {
  content: Scalars['String'];
  description: Scalars['String'];
  slug?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['ID']>>;
  title: Scalars['String'];
};

export type CreatePostTags = CreatePostTagsValidationError | DuplicatePostTagError | NotAllowedError | PostTags | PostTagsWarning;

export type CreatePostTagsValidationError = {
  __typename?: 'CreatePostTagsValidationError';
  status: Status;
  tagsError: Scalars['String'];
};

export type CreatePostValidationError = {
  __typename?: 'CreatePostValidationError';
  contentError?: Maybe<Scalars['String']>;
  descriptionError?: Maybe<Scalars['String']>;
  slugError?: Maybe<Scalars['String']>;
  status: Status;
  tagsError?: Maybe<Scalars['String']>;
  titleError?: Maybe<Scalars['String']>;
};

export type CreateUser = EmailValidationError | NotAllowedError | Response | ServerError;

export type DeletePostTags = DeletePostTagsValidationError | NotAllowedError | PostTags | PostTagsWarning | UnknownError;

export type DeletePostTagsValidationError = {
  __typename?: 'DeletePostTagsValidationError';
  status: Status;
  tagIdsError: Scalars['String'];
};

export type DraftPostInput = {
  content?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  postId?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['ID']>>;
  title: Scalars['String'];
};

export type Draft_Edit = DuplicatePostTitleError | NotAllowedError | NotAllowedPostActionError | PostValidationError | SinglePost | UnauthorizedAuthorError | UnknownError;

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

export type EditPostInput = {
  content: Scalars['String'];
  description: Scalars['String'];
  postId: Scalars['ID'];
  slug?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['ID']>>;
  title: Scalars['String'];
};

export type EditPostTag = DuplicatePostTagError | EditPostTagValidationError | EditedPostTag | NotAllowedError | UnknownError;

export type EditPostTagValidationError = {
  __typename?: 'EditPostTagValidationError';
  nameError?: Maybe<Scalars['String']>;
  status: Status;
  tagIdError?: Maybe<Scalars['String']>;
};

export type EditProfile = EditProfileValidationError | EditedProfile | NotAllowedError | RegistrationError;

export type EditProfileValidationError = {
  __typename?: 'EditProfileValidationError';
  firstNameError?: Maybe<Scalars['String']>;
  lastNameError?: Maybe<Scalars['String']>;
  status: Status;
};

export type EditedPostTag = {
  __typename?: 'EditedPostTag';
  status: Status;
  tag: PostTag;
};

export type EditedProfile = {
  __typename?: 'EditedProfile';
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  status: Status;
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

export type ForgotGeneratePassword = EmailValidationError | NotAllowedError | RegistrationError | Response | ServerError;

export type GetPost = NotAllowedError | PostIdValidationError | SinglePost | UnknownError;

export type GetPostTags = NotAllowedError | PostTags;

export type GetPosts = NotAllowedError | Posts;

export type LoggedInUser = {
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
  createPost: CreatePost;
  /** Create a new post tag or multiple tags */
  createPostTags: CreatePostTags;
  /** Create a new user */
  createUser: CreateUser;
  /** Delete a post tag or multiple post tags */
  deletePostTags: DeletePostTags;
  /** Delete posts from bin */
  deletePostsFromBin: Bin_UnBin_Delete;
  /** Draft a post */
  draftPost: Draft_Edit;
  /** Edit a created/published post */
  editPost: Draft_Edit;
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
  author: Scalars['String'];
  content?: Maybe<Scalars['String']>;
  dateCreated: Scalars['String'];
  datePublished?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageBanner?: Maybe<Scalars['String']>;
  isDeleted: Scalars['Boolean'];
  isInBin: Scalars['Boolean'];
  lastModified?: Maybe<Scalars['String']>;
  likes: Scalars['Int'];
  slug?: Maybe<Scalars['String']>;
  status: PostStatus;
  tags?: Maybe<Array<PostTag>>;
  title: Scalars['String'];
  url: Scalars['String'];
  views: Scalars['Int'];
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

export enum PostStatus {
  Draft = 'Draft',
  Published = 'Published',
  Unpublished = 'Unpublished'
}

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

export type PostTagsWarning = BaseResponse & {
  __typename?: 'PostTagsWarning';
  message: Scalars['String'];
  status: Status;
  tags: Array<PostTag>;
};

export type PostValidationError = {
  __typename?: 'PostValidationError';
  contentError?: Maybe<Scalars['String']>;
  descriptionError?: Maybe<Scalars['String']>;
  postIdError?: Maybe<Scalars['String']>;
  slugError?: Maybe<Scalars['String']>;
  status: Status;
  tagsError?: Maybe<Scalars['String']>;
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
  /** Get one post */
  getPost: GetPost;
  /** Get all post tags */
  getPostTags: GetPostTags;
  /** Get all posts */
  getPosts: GetPosts;
  /** Verify user session */
  verifySession: VerifySession;
};


export type QueryGetPostArgs = {
  postId: Scalars['ID'];
};


export type QueryVerifySessionArgs = {
  sessionId: Scalars['String'];
};

export type RefreshToken = AccessToken | AuthenticationError | NotAllowedError | SessionIdValidationError | UnknownError | UserSessionError;

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

export type RegisteredUser = {
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

export enum Status {
  Error = 'ERROR',
  Success = 'SUCCESS',
  Warn = 'WARN'
}

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

export type VerifiedSession = {
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

export type VerifySession = NotAllowedError | SessionIdValidationError | UnknownError | UserSessionError | VerifiedSession;

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AccessToken: ResolverTypeWrapper<AccessToken>;
  AuthenticationError: ResolverTypeWrapper<AuthenticationError>;
  BaseResponse: ResolversTypes['AuthenticationError'] | ResolversTypes['DuplicatePostTagError'] | ResolversTypes['DuplicatePostTitleError'] | ResolversTypes['EmptyBinWarning'] | ResolversTypes['NotAllowedError'] | ResolversTypes['NotAllowedPostActionError'] | ResolversTypes['PostTagsWarning'] | ResolversTypes['PostsWarning'] | ResolversTypes['RegistrationError'] | ResolversTypes['Response'] | ResolversTypes['ServerError'] | ResolversTypes['UnauthorizedAuthorError'] | ResolversTypes['UnknownError'] | ResolversTypes['UserSessionError'];
  Bin_UnBin_Delete: ResolversTypes['NotAllowedError'] | ResolversTypes['PostIdsValidationError'] | ResolversTypes['Posts'] | ResolversTypes['PostsWarning'] | ResolversTypes['UnauthorizedAuthorError'] | ResolversTypes['UnknownError'];
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ChangePassword: ResolversTypes['ChangePasswordValidationError'] | ResolversTypes['NotAllowedError'] | ResolversTypes['RegistrationError'] | ResolversTypes['Response'] | ResolversTypes['ServerError'] | ResolversTypes['UnknownError'];
  ChangePasswordValidationError: ResolverTypeWrapper<ChangePasswordValidationError>;
  CreatePost: ResolversTypes['CreatePostValidationError'] | ResolversTypes['DuplicatePostTitleError'] | ResolversTypes['NotAllowedError'] | ResolversTypes['SinglePost'] | ResolversTypes['UnknownError'];
  CreatePostInput: CreatePostInput;
  CreatePostTags: ResolversTypes['CreatePostTagsValidationError'] | ResolversTypes['DuplicatePostTagError'] | ResolversTypes['NotAllowedError'] | ResolversTypes['PostTags'] | ResolversTypes['PostTagsWarning'];
  CreatePostTagsValidationError: ResolverTypeWrapper<CreatePostTagsValidationError>;
  CreatePostValidationError: ResolverTypeWrapper<CreatePostValidationError>;
  CreateUser: ResolversTypes['EmailValidationError'] | ResolversTypes['NotAllowedError'] | ResolversTypes['Response'] | ResolversTypes['ServerError'];
  DeletePostTags: ResolversTypes['DeletePostTagsValidationError'] | ResolversTypes['NotAllowedError'] | ResolversTypes['PostTags'] | ResolversTypes['PostTagsWarning'] | ResolversTypes['UnknownError'];
  DeletePostTagsValidationError: ResolverTypeWrapper<DeletePostTagsValidationError>;
  DraftPostInput: DraftPostInput;
  Draft_Edit: ResolversTypes['DuplicatePostTitleError'] | ResolversTypes['NotAllowedError'] | ResolversTypes['NotAllowedPostActionError'] | ResolversTypes['PostValidationError'] | ResolversTypes['SinglePost'] | ResolversTypes['UnauthorizedAuthorError'] | ResolversTypes['UnknownError'];
  DuplicatePostTagError: ResolverTypeWrapper<DuplicatePostTagError>;
  DuplicatePostTitleError: ResolverTypeWrapper<DuplicatePostTitleError>;
  EditPostInput: EditPostInput;
  EditPostTag: ResolversTypes['DuplicatePostTagError'] | ResolversTypes['EditPostTagValidationError'] | ResolversTypes['EditedPostTag'] | ResolversTypes['NotAllowedError'] | ResolversTypes['UnknownError'];
  EditPostTagValidationError: ResolverTypeWrapper<EditPostTagValidationError>;
  EditProfile: ResolversTypes['EditProfileValidationError'] | ResolversTypes['EditedProfile'] | ResolversTypes['NotAllowedError'] | ResolversTypes['RegistrationError'];
  EditProfileValidationError: ResolverTypeWrapper<EditProfileValidationError>;
  EditedPostTag: ResolverTypeWrapper<EditedPostTag>;
  EditedProfile: ResolverTypeWrapper<EditedProfile>;
  EmailValidationError: ResolverTypeWrapper<EmailValidationError>;
  EmptyBin: ResolversTypes['EmptyBinWarning'] | ResolversTypes['NotAllowedError'] | ResolversTypes['Posts'];
  EmptyBinWarning: ResolverTypeWrapper<EmptyBinWarning>;
  ForgotGeneratePassword: ResolversTypes['EmailValidationError'] | ResolversTypes['NotAllowedError'] | ResolversTypes['RegistrationError'] | ResolversTypes['Response'] | ResolversTypes['ServerError'];
  GetPost: ResolversTypes['NotAllowedError'] | ResolversTypes['PostIdValidationError'] | ResolversTypes['SinglePost'] | ResolversTypes['UnknownError'];
  GetPostTags: ResolversTypes['NotAllowedError'] | ResolversTypes['PostTags'];
  GetPosts: ResolversTypes['NotAllowedError'] | ResolversTypes['Posts'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LoggedInUser: ResolverTypeWrapper<LoggedInUser>;
  Login: ResolversTypes['LoggedInUser'] | ResolversTypes['LoginValidationError'] | ResolversTypes['NotAllowedError'];
  LoginValidationError: ResolverTypeWrapper<LoginValidationError>;
  Logout: ResolversTypes['AuthenticationError'] | ResolversTypes['NotAllowedError'] | ResolversTypes['Response'] | ResolversTypes['SessionIdValidationError'] | ResolversTypes['UnknownError'];
  Mutation: ResolverTypeWrapper<{}>;
  NotAllowedError: ResolverTypeWrapper<NotAllowedError>;
  NotAllowedPostActionError: ResolverTypeWrapper<NotAllowedPostActionError>;
  Post: ResolverTypeWrapper<Post>;
  PostIdValidationError: ResolverTypeWrapper<PostIdValidationError>;
  PostIdsValidationError: ResolverTypeWrapper<PostIdsValidationError>;
  PostStatus: PostStatus;
  PostTag: ResolverTypeWrapper<PostTag>;
  PostTags: ResolverTypeWrapper<PostTags>;
  PostTagsWarning: ResolverTypeWrapper<PostTagsWarning>;
  PostValidationError: ResolverTypeWrapper<PostValidationError>;
  Posts: ResolverTypeWrapper<Posts>;
  PostsWarning: ResolverTypeWrapper<PostsWarning>;
  Publish_Unpublish: ResolversTypes['NotAllowedError'] | ResolversTypes['NotAllowedPostActionError'] | ResolversTypes['PostIdValidationError'] | ResolversTypes['SinglePost'] | ResolversTypes['UnauthorizedAuthorError'] | ResolversTypes['UnknownError'];
  Query: ResolverTypeWrapper<{}>;
  RefreshToken: ResolversTypes['AccessToken'] | ResolversTypes['AuthenticationError'] | ResolversTypes['NotAllowedError'] | ResolversTypes['SessionIdValidationError'] | ResolversTypes['UnknownError'] | ResolversTypes['UserSessionError'];
  RegisterUser: ResolversTypes['AuthenticationError'] | ResolversTypes['RegisterUserValidationError'] | ResolversTypes['RegisteredUser'] | ResolversTypes['RegistrationError'] | ResolversTypes['UnknownError'];
  RegisterUserInput: RegisterUserInput;
  RegisterUserValidationError: ResolverTypeWrapper<RegisterUserValidationError>;
  RegisteredUser: ResolverTypeWrapper<RegisteredUser>;
  RegistrationError: ResolverTypeWrapper<RegistrationError>;
  ResetPassword: ResolversTypes['NotAllowedError'] | ResolversTypes['RegistrationError'] | ResolversTypes['ResetPasswordValidationError'] | ResolversTypes['Response'];
  ResetPasswordValidationError: ResolverTypeWrapper<ResetPasswordValidationError>;
  Response: ResolverTypeWrapper<Response>;
  ServerError: ResolverTypeWrapper<ServerError>;
  SessionIdValidationError: ResolverTypeWrapper<SessionIdValidationError>;
  SinglePost: ResolverTypeWrapper<SinglePost>;
  Status: Status;
  String: ResolverTypeWrapper<Scalars['String']>;
  UnauthorizedAuthorError: ResolverTypeWrapper<UnauthorizedAuthorError>;
  UnknownError: ResolverTypeWrapper<UnknownError>;
  User: ResolverTypeWrapper<User>;
  UserSessionError: ResolverTypeWrapper<UserSessionError>;
  VerifiedResetToken: ResolverTypeWrapper<VerifiedResetToken>;
  VerifiedSession: ResolverTypeWrapper<VerifiedSession>;
  VerifyResetToken: ResolversTypes['NotAllowedError'] | ResolversTypes['RegistrationError'] | ResolversTypes['VerifiedResetToken'] | ResolversTypes['VerifyResetTokenValidationError'];
  VerifyResetTokenValidationError: ResolverTypeWrapper<VerifyResetTokenValidationError>;
  VerifySession: ResolversTypes['NotAllowedError'] | ResolversTypes['SessionIdValidationError'] | ResolversTypes['UnknownError'] | ResolversTypes['UserSessionError'] | ResolversTypes['VerifiedSession'];
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccessToken: AccessToken;
  AuthenticationError: AuthenticationError;
  BaseResponse: ResolversParentTypes['AuthenticationError'] | ResolversParentTypes['DuplicatePostTagError'] | ResolversParentTypes['DuplicatePostTitleError'] | ResolversParentTypes['EmptyBinWarning'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['NotAllowedPostActionError'] | ResolversParentTypes['PostTagsWarning'] | ResolversParentTypes['PostsWarning'] | ResolversParentTypes['RegistrationError'] | ResolversParentTypes['Response'] | ResolversParentTypes['ServerError'] | ResolversParentTypes['UnauthorizedAuthorError'] | ResolversParentTypes['UnknownError'] | ResolversParentTypes['UserSessionError'];
  Bin_UnBin_Delete: ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['PostIdsValidationError'] | ResolversParentTypes['Posts'] | ResolversParentTypes['PostsWarning'] | ResolversParentTypes['UnauthorizedAuthorError'] | ResolversParentTypes['UnknownError'];
  Boolean: Scalars['Boolean'];
  ChangePassword: ResolversParentTypes['ChangePasswordValidationError'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['RegistrationError'] | ResolversParentTypes['Response'] | ResolversParentTypes['ServerError'] | ResolversParentTypes['UnknownError'];
  ChangePasswordValidationError: ChangePasswordValidationError;
  CreatePost: ResolversParentTypes['CreatePostValidationError'] | ResolversParentTypes['DuplicatePostTitleError'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['SinglePost'] | ResolversParentTypes['UnknownError'];
  CreatePostInput: CreatePostInput;
  CreatePostTags: ResolversParentTypes['CreatePostTagsValidationError'] | ResolversParentTypes['DuplicatePostTagError'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['PostTags'] | ResolversParentTypes['PostTagsWarning'];
  CreatePostTagsValidationError: CreatePostTagsValidationError;
  CreatePostValidationError: CreatePostValidationError;
  CreateUser: ResolversParentTypes['EmailValidationError'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['Response'] | ResolversParentTypes['ServerError'];
  DeletePostTags: ResolversParentTypes['DeletePostTagsValidationError'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['PostTags'] | ResolversParentTypes['PostTagsWarning'] | ResolversParentTypes['UnknownError'];
  DeletePostTagsValidationError: DeletePostTagsValidationError;
  DraftPostInput: DraftPostInput;
  Draft_Edit: ResolversParentTypes['DuplicatePostTitleError'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['NotAllowedPostActionError'] | ResolversParentTypes['PostValidationError'] | ResolversParentTypes['SinglePost'] | ResolversParentTypes['UnauthorizedAuthorError'] | ResolversParentTypes['UnknownError'];
  DuplicatePostTagError: DuplicatePostTagError;
  DuplicatePostTitleError: DuplicatePostTitleError;
  EditPostInput: EditPostInput;
  EditPostTag: ResolversParentTypes['DuplicatePostTagError'] | ResolversParentTypes['EditPostTagValidationError'] | ResolversParentTypes['EditedPostTag'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['UnknownError'];
  EditPostTagValidationError: EditPostTagValidationError;
  EditProfile: ResolversParentTypes['EditProfileValidationError'] | ResolversParentTypes['EditedProfile'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['RegistrationError'];
  EditProfileValidationError: EditProfileValidationError;
  EditedPostTag: EditedPostTag;
  EditedProfile: EditedProfile;
  EmailValidationError: EmailValidationError;
  EmptyBin: ResolversParentTypes['EmptyBinWarning'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['Posts'];
  EmptyBinWarning: EmptyBinWarning;
  ForgotGeneratePassword: ResolversParentTypes['EmailValidationError'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['RegistrationError'] | ResolversParentTypes['Response'] | ResolversParentTypes['ServerError'];
  GetPost: ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['PostIdValidationError'] | ResolversParentTypes['SinglePost'] | ResolversParentTypes['UnknownError'];
  GetPostTags: ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['PostTags'];
  GetPosts: ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['Posts'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  LoggedInUser: LoggedInUser;
  Login: ResolversParentTypes['LoggedInUser'] | ResolversParentTypes['LoginValidationError'] | ResolversParentTypes['NotAllowedError'];
  LoginValidationError: LoginValidationError;
  Logout: ResolversParentTypes['AuthenticationError'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['Response'] | ResolversParentTypes['SessionIdValidationError'] | ResolversParentTypes['UnknownError'];
  Mutation: {};
  NotAllowedError: NotAllowedError;
  NotAllowedPostActionError: NotAllowedPostActionError;
  Post: Post;
  PostIdValidationError: PostIdValidationError;
  PostIdsValidationError: PostIdsValidationError;
  PostTag: PostTag;
  PostTags: PostTags;
  PostTagsWarning: PostTagsWarning;
  PostValidationError: PostValidationError;
  Posts: Posts;
  PostsWarning: PostsWarning;
  Publish_Unpublish: ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['NotAllowedPostActionError'] | ResolversParentTypes['PostIdValidationError'] | ResolversParentTypes['SinglePost'] | ResolversParentTypes['UnauthorizedAuthorError'] | ResolversParentTypes['UnknownError'];
  Query: {};
  RefreshToken: ResolversParentTypes['AccessToken'] | ResolversParentTypes['AuthenticationError'] | ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['SessionIdValidationError'] | ResolversParentTypes['UnknownError'] | ResolversParentTypes['UserSessionError'];
  RegisterUser: ResolversParentTypes['AuthenticationError'] | ResolversParentTypes['RegisterUserValidationError'] | ResolversParentTypes['RegisteredUser'] | ResolversParentTypes['RegistrationError'] | ResolversParentTypes['UnknownError'];
  RegisterUserInput: RegisterUserInput;
  RegisterUserValidationError: RegisterUserValidationError;
  RegisteredUser: RegisteredUser;
  RegistrationError: RegistrationError;
  ResetPassword: ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['RegistrationError'] | ResolversParentTypes['ResetPasswordValidationError'] | ResolversParentTypes['Response'];
  ResetPasswordValidationError: ResetPasswordValidationError;
  Response: Response;
  ServerError: ServerError;
  SessionIdValidationError: SessionIdValidationError;
  SinglePost: SinglePost;
  String: Scalars['String'];
  UnauthorizedAuthorError: UnauthorizedAuthorError;
  UnknownError: UnknownError;
  User: User;
  UserSessionError: UserSessionError;
  VerifiedResetToken: VerifiedResetToken;
  VerifiedSession: VerifiedSession;
  VerifyResetToken: ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['RegistrationError'] | ResolversParentTypes['VerifiedResetToken'] | ResolversParentTypes['VerifyResetTokenValidationError'];
  VerifyResetTokenValidationError: VerifyResetTokenValidationError;
  VerifySession: ResolversParentTypes['NotAllowedError'] | ResolversParentTypes['SessionIdValidationError'] | ResolversParentTypes['UnknownError'] | ResolversParentTypes['UserSessionError'] | ResolversParentTypes['VerifiedSession'];
}>;

export type AccessTokenResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['AccessToken'] = ResolversParentTypes['AccessToken']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthenticationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['AuthenticationError'] = ResolversParentTypes['AuthenticationError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BaseResponseResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['BaseResponse'] = ResolversParentTypes['BaseResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthenticationError' | 'DuplicatePostTagError' | 'DuplicatePostTitleError' | 'EmptyBinWarning' | 'NotAllowedError' | 'NotAllowedPostActionError' | 'PostTagsWarning' | 'PostsWarning' | 'RegistrationError' | 'Response' | 'ServerError' | 'UnauthorizedAuthorError' | 'UnknownError' | 'UserSessionError', ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
}>;

export type Bin_UnBin_DeleteResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['Bin_UnBin_Delete'] = ResolversParentTypes['Bin_UnBin_Delete']> = ResolversObject<{
  __resolveType: TypeResolveFn<'NotAllowedError' | 'PostIdsValidationError' | 'Posts' | 'PostsWarning' | 'UnauthorizedAuthorError' | 'UnknownError', ParentType, ContextType>;
}>;

export type ChangePasswordResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['ChangePassword'] = ResolversParentTypes['ChangePassword']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ChangePasswordValidationError' | 'NotAllowedError' | 'RegistrationError' | 'Response' | 'ServerError' | 'UnknownError', ParentType, ContextType>;
}>;

export type ChangePasswordValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['ChangePasswordValidationError'] = ResolversParentTypes['ChangePasswordValidationError']> = ResolversObject<{
  confirmNewPasswordError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  currentPasswordError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  newPasswordError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreatePostResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['CreatePost'] = ResolversParentTypes['CreatePost']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreatePostValidationError' | 'DuplicatePostTitleError' | 'NotAllowedError' | 'SinglePost' | 'UnknownError', ParentType, ContextType>;
}>;

export type CreatePostTagsResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['CreatePostTags'] = ResolversParentTypes['CreatePostTags']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreatePostTagsValidationError' | 'DuplicatePostTagError' | 'NotAllowedError' | 'PostTags' | 'PostTagsWarning', ParentType, ContextType>;
}>;

export type CreatePostTagsValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['CreatePostTagsValidationError'] = ResolversParentTypes['CreatePostTagsValidationError']> = ResolversObject<{
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  tagsError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreatePostValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['CreatePostValidationError'] = ResolversParentTypes['CreatePostValidationError']> = ResolversObject<{
  contentError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slugError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  tagsError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  titleError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateUserResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['CreateUser'] = ResolversParentTypes['CreateUser']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EmailValidationError' | 'NotAllowedError' | 'Response' | 'ServerError', ParentType, ContextType>;
}>;

export type DeletePostTagsResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['DeletePostTags'] = ResolversParentTypes['DeletePostTags']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DeletePostTagsValidationError' | 'NotAllowedError' | 'PostTags' | 'PostTagsWarning' | 'UnknownError', ParentType, ContextType>;
}>;

export type DeletePostTagsValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['DeletePostTagsValidationError'] = ResolversParentTypes['DeletePostTagsValidationError']> = ResolversObject<{
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  tagIdsError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Draft_EditResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['Draft_Edit'] = ResolversParentTypes['Draft_Edit']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DuplicatePostTitleError' | 'NotAllowedError' | 'NotAllowedPostActionError' | 'PostValidationError' | 'SinglePost' | 'UnauthorizedAuthorError' | 'UnknownError', ParentType, ContextType>;
}>;

export type DuplicatePostTagErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['DuplicatePostTagError'] = ResolversParentTypes['DuplicatePostTagError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DuplicatePostTitleErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['DuplicatePostTitleError'] = ResolversParentTypes['DuplicatePostTitleError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditPostTagResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['EditPostTag'] = ResolversParentTypes['EditPostTag']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DuplicatePostTagError' | 'EditPostTagValidationError' | 'EditedPostTag' | 'NotAllowedError' | 'UnknownError', ParentType, ContextType>;
}>;

export type EditPostTagValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['EditPostTagValidationError'] = ResolversParentTypes['EditPostTagValidationError']> = ResolversObject<{
  nameError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  tagIdError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditProfileResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['EditProfile'] = ResolversParentTypes['EditProfile']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EditProfileValidationError' | 'EditedProfile' | 'NotAllowedError' | 'RegistrationError', ParentType, ContextType>;
}>;

export type EditProfileValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['EditProfileValidationError'] = ResolversParentTypes['EditProfileValidationError']> = ResolversObject<{
  firstNameError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastNameError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditedPostTagResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['EditedPostTag'] = ResolversParentTypes['EditedPostTag']> = ResolversObject<{
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  tag?: Resolver<ResolversTypes['PostTag'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditedProfileResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['EditedProfile'] = ResolversParentTypes['EditedProfile']> = ResolversObject<{
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmailValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['EmailValidationError'] = ResolversParentTypes['EmailValidationError']> = ResolversObject<{
  emailError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmptyBinResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['EmptyBin'] = ResolversParentTypes['EmptyBin']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EmptyBinWarning' | 'NotAllowedError' | 'Posts', ParentType, ContextType>;
}>;

export type EmptyBinWarningResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['EmptyBinWarning'] = ResolversParentTypes['EmptyBinWarning']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ForgotGeneratePasswordResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['ForgotGeneratePassword'] = ResolversParentTypes['ForgotGeneratePassword']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EmailValidationError' | 'NotAllowedError' | 'RegistrationError' | 'Response' | 'ServerError', ParentType, ContextType>;
}>;

export type GetPostResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['GetPost'] = ResolversParentTypes['GetPost']> = ResolversObject<{
  __resolveType: TypeResolveFn<'NotAllowedError' | 'PostIdValidationError' | 'SinglePost' | 'UnknownError', ParentType, ContextType>;
}>;

export type GetPostTagsResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['GetPostTags'] = ResolversParentTypes['GetPostTags']> = ResolversObject<{
  __resolveType: TypeResolveFn<'NotAllowedError' | 'PostTags', ParentType, ContextType>;
}>;

export type GetPostsResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['GetPosts'] = ResolversParentTypes['GetPosts']> = ResolversObject<{
  __resolveType: TypeResolveFn<'NotAllowedError' | 'Posts', ParentType, ContextType>;
}>;

export type LoggedInUserResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['LoggedInUser'] = ResolversParentTypes['LoggedInUser']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sessionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['Login'] = ResolversParentTypes['Login']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LoggedInUser' | 'LoginValidationError' | 'NotAllowedError', ParentType, ContextType>;
}>;

export type LoginValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['LoginValidationError'] = ResolversParentTypes['LoginValidationError']> = ResolversObject<{
  emailError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  passwordError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LogoutResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['Logout'] = ResolversParentTypes['Logout']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthenticationError' | 'NotAllowedError' | 'Response' | 'SessionIdValidationError' | 'UnknownError', ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  binPosts?: Resolver<ResolversTypes['Bin_UnBin_Delete'], ParentType, ContextType, RequireFields<MutationBinPostsArgs, 'postIds'>>;
  changePassword?: Resolver<ResolversTypes['ChangePassword'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'confirmNewPassword' | 'currentPassword' | 'newPassword'>>;
  createPost?: Resolver<ResolversTypes['CreatePost'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'post'>>;
  createPostTags?: Resolver<ResolversTypes['CreatePostTags'], ParentType, ContextType, RequireFields<MutationCreatePostTagsArgs, 'tags'>>;
  createUser?: Resolver<ResolversTypes['CreateUser'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'email'>>;
  deletePostTags?: Resolver<ResolversTypes['DeletePostTags'], ParentType, ContextType, RequireFields<MutationDeletePostTagsArgs, 'tagIds'>>;
  deletePostsFromBin?: Resolver<ResolversTypes['Bin_UnBin_Delete'], ParentType, ContextType, RequireFields<MutationDeletePostsFromBinArgs, 'postIds'>>;
  draftPost?: Resolver<ResolversTypes['Draft_Edit'], ParentType, ContextType, RequireFields<MutationDraftPostArgs, 'post'>>;
  editPost?: Resolver<ResolversTypes['Draft_Edit'], ParentType, ContextType, RequireFields<MutationEditPostArgs, 'post'>>;
  editPostTag?: Resolver<ResolversTypes['EditPostTag'], ParentType, ContextType, RequireFields<MutationEditPostTagArgs, 'name' | 'tagId'>>;
  editProfile?: Resolver<ResolversTypes['EditProfile'], ParentType, ContextType, RequireFields<MutationEditProfileArgs, 'firstName' | 'lastName'>>;
  emptyBin?: Resolver<ResolversTypes['EmptyBin'], ParentType, ContextType>;
  forgotPassword?: Resolver<ResolversTypes['ForgotGeneratePassword'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'email'>>;
  generatePassword?: Resolver<ResolversTypes['ForgotGeneratePassword'], ParentType, ContextType, RequireFields<MutationGeneratePasswordArgs, 'email'>>;
  login?: Resolver<ResolversTypes['Login'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  logout?: Resolver<ResolversTypes['Logout'], ParentType, ContextType, RequireFields<MutationLogoutArgs, 'sessionId'>>;
  publishPost?: Resolver<ResolversTypes['Publish_Unpublish'], ParentType, ContextType, RequireFields<MutationPublishPostArgs, 'postId'>>;
  refreshToken?: Resolver<ResolversTypes['RefreshToken'], ParentType, ContextType, RequireFields<MutationRefreshTokenArgs, 'sessionId'>>;
  registerUser?: Resolver<ResolversTypes['RegisterUser'], ParentType, ContextType, RequireFields<MutationRegisterUserArgs, 'userInput'>>;
  resetPassword?: Resolver<ResolversTypes['ResetPassword'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'confirmPassword' | 'password' | 'token'>>;
  unBinPosts?: Resolver<ResolversTypes['Bin_UnBin_Delete'], ParentType, ContextType, RequireFields<MutationUnBinPostsArgs, 'postIds'>>;
  unpublishPost?: Resolver<ResolversTypes['Publish_Unpublish'], ParentType, ContextType, RequireFields<MutationUnpublishPostArgs, 'postId'>>;
  verifyResetToken?: Resolver<ResolversTypes['VerifyResetToken'], ParentType, ContextType, RequireFields<MutationVerifyResetTokenArgs, 'token'>>;
}>;

export type NotAllowedErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['NotAllowedError'] = ResolversParentTypes['NotAllowedError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NotAllowedPostActionErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['NotAllowedPostActionError'] = ResolversParentTypes['NotAllowedPostActionError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  author?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dateCreated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  datePublished?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageBanner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isDeleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isInBin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastModified?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['PostStatus'], ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['PostTag']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  views?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostIdValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['PostIdValidationError'] = ResolversParentTypes['PostIdValidationError']> = ResolversObject<{
  postIdError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostIdsValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['PostIdsValidationError'] = ResolversParentTypes['PostIdsValidationError']> = ResolversObject<{
  postIdsError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostTagResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['PostTag'] = ResolversParentTypes['PostTag']> = ResolversObject<{
  dateCreated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastModified?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostTagsResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['PostTags'] = ResolversParentTypes['PostTags']> = ResolversObject<{
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['PostTag']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostTagsWarningResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['PostTagsWarning'] = ResolversParentTypes['PostTagsWarning']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['PostTag']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['PostValidationError'] = ResolversParentTypes['PostValidationError']> = ResolversObject<{
  contentError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  descriptionError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postIdError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slugError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  tagsError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  titleError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostsResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['Posts'] = ResolversParentTypes['Posts']> = ResolversObject<{
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostsWarningResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['PostsWarning'] = ResolversParentTypes['PostsWarning']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Publish_UnpublishResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['Publish_Unpublish'] = ResolversParentTypes['Publish_Unpublish']> = ResolversObject<{
  __resolveType: TypeResolveFn<'NotAllowedError' | 'NotAllowedPostActionError' | 'PostIdValidationError' | 'SinglePost' | 'UnauthorizedAuthorError' | 'UnknownError', ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getPost?: Resolver<ResolversTypes['GetPost'], ParentType, ContextType, RequireFields<QueryGetPostArgs, 'postId'>>;
  getPostTags?: Resolver<ResolversTypes['GetPostTags'], ParentType, ContextType>;
  getPosts?: Resolver<ResolversTypes['GetPosts'], ParentType, ContextType>;
  verifySession?: Resolver<ResolversTypes['VerifySession'], ParentType, ContextType, RequireFields<QueryVerifySessionArgs, 'sessionId'>>;
}>;

export type RefreshTokenResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['RefreshToken'] = ResolversParentTypes['RefreshToken']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AccessToken' | 'AuthenticationError' | 'NotAllowedError' | 'SessionIdValidationError' | 'UnknownError' | 'UserSessionError', ParentType, ContextType>;
}>;

export type RegisterUserResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['RegisterUser'] = ResolversParentTypes['RegisterUser']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthenticationError' | 'RegisterUserValidationError' | 'RegisteredUser' | 'RegistrationError' | 'UnknownError', ParentType, ContextType>;
}>;

export type RegisterUserValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['RegisterUserValidationError'] = ResolversParentTypes['RegisterUserValidationError']> = ResolversObject<{
  confirmPasswordError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstNameError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastNameError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  passwordError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegisteredUserResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['RegisteredUser'] = ResolversParentTypes['RegisteredUser']> = ResolversObject<{
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegistrationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['RegistrationError'] = ResolversParentTypes['RegistrationError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ResetPasswordResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['ResetPassword'] = ResolversParentTypes['ResetPassword']> = ResolversObject<{
  __resolveType: TypeResolveFn<'NotAllowedError' | 'RegistrationError' | 'ResetPasswordValidationError' | 'Response', ParentType, ContextType>;
}>;

export type ResetPasswordValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['ResetPasswordValidationError'] = ResolversParentTypes['ResetPasswordValidationError']> = ResolversObject<{
  confirmPasswordError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  passwordError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  tokenError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ResponseResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['Response'] = ResolversParentTypes['Response']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ServerErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['ServerError'] = ResolversParentTypes['ServerError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SessionIdValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['SessionIdValidationError'] = ResolversParentTypes['SessionIdValidationError']> = ResolversObject<{
  sessionIdError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SinglePostResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['SinglePost'] = ResolversParentTypes['SinglePost']> = ResolversObject<{
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnauthorizedAuthorErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['UnauthorizedAuthorError'] = ResolversParentTypes['UnauthorizedAuthorError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnknownErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['UnknownError'] = ResolversParentTypes['UnknownError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  dateCreated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isRegistered?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserSessionErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['UserSessionError'] = ResolversParentTypes['UserSessionError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VerifiedResetTokenResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['VerifiedResetToken'] = ResolversParentTypes['VerifiedResetToken']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resetToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VerifiedSessionResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['VerifiedSession'] = ResolversParentTypes['VerifiedSession']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VerifyResetTokenResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['VerifyResetToken'] = ResolversParentTypes['VerifyResetToken']> = ResolversObject<{
  __resolveType: TypeResolveFn<'NotAllowedError' | 'RegistrationError' | 'VerifiedResetToken' | 'VerifyResetTokenValidationError', ParentType, ContextType>;
}>;

export type VerifyResetTokenValidationErrorResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['VerifyResetTokenValidationError'] = ResolversParentTypes['VerifyResetTokenValidationError']> = ResolversObject<{
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  tokenError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VerifySessionResolvers<ContextType = APIContext, ParentType extends ResolversParentTypes['VerifySession'] = ResolversParentTypes['VerifySession']> = ResolversObject<{
  __resolveType: TypeResolveFn<'NotAllowedError' | 'SessionIdValidationError' | 'UnknownError' | 'UserSessionError' | 'VerifiedSession', ParentType, ContextType>;
}>;

export type Resolvers<ContextType = APIContext> = ResolversObject<{
  AccessToken?: AccessTokenResolvers<ContextType>;
  AuthenticationError?: AuthenticationErrorResolvers<ContextType>;
  BaseResponse?: BaseResponseResolvers<ContextType>;
  Bin_UnBin_Delete?: Bin_UnBin_DeleteResolvers<ContextType>;
  ChangePassword?: ChangePasswordResolvers<ContextType>;
  ChangePasswordValidationError?: ChangePasswordValidationErrorResolvers<ContextType>;
  CreatePost?: CreatePostResolvers<ContextType>;
  CreatePostTags?: CreatePostTagsResolvers<ContextType>;
  CreatePostTagsValidationError?: CreatePostTagsValidationErrorResolvers<ContextType>;
  CreatePostValidationError?: CreatePostValidationErrorResolvers<ContextType>;
  CreateUser?: CreateUserResolvers<ContextType>;
  DeletePostTags?: DeletePostTagsResolvers<ContextType>;
  DeletePostTagsValidationError?: DeletePostTagsValidationErrorResolvers<ContextType>;
  Draft_Edit?: Draft_EditResolvers<ContextType>;
  DuplicatePostTagError?: DuplicatePostTagErrorResolvers<ContextType>;
  DuplicatePostTitleError?: DuplicatePostTitleErrorResolvers<ContextType>;
  EditPostTag?: EditPostTagResolvers<ContextType>;
  EditPostTagValidationError?: EditPostTagValidationErrorResolvers<ContextType>;
  EditProfile?: EditProfileResolvers<ContextType>;
  EditProfileValidationError?: EditProfileValidationErrorResolvers<ContextType>;
  EditedPostTag?: EditedPostTagResolvers<ContextType>;
  EditedProfile?: EditedProfileResolvers<ContextType>;
  EmailValidationError?: EmailValidationErrorResolvers<ContextType>;
  EmptyBin?: EmptyBinResolvers<ContextType>;
  EmptyBinWarning?: EmptyBinWarningResolvers<ContextType>;
  ForgotGeneratePassword?: ForgotGeneratePasswordResolvers<ContextType>;
  GetPost?: GetPostResolvers<ContextType>;
  GetPostTags?: GetPostTagsResolvers<ContextType>;
  GetPosts?: GetPostsResolvers<ContextType>;
  LoggedInUser?: LoggedInUserResolvers<ContextType>;
  Login?: LoginResolvers<ContextType>;
  LoginValidationError?: LoginValidationErrorResolvers<ContextType>;
  Logout?: LogoutResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NotAllowedError?: NotAllowedErrorResolvers<ContextType>;
  NotAllowedPostActionError?: NotAllowedPostActionErrorResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostIdValidationError?: PostIdValidationErrorResolvers<ContextType>;
  PostIdsValidationError?: PostIdsValidationErrorResolvers<ContextType>;
  PostTag?: PostTagResolvers<ContextType>;
  PostTags?: PostTagsResolvers<ContextType>;
  PostTagsWarning?: PostTagsWarningResolvers<ContextType>;
  PostValidationError?: PostValidationErrorResolvers<ContextType>;
  Posts?: PostsResolvers<ContextType>;
  PostsWarning?: PostsWarningResolvers<ContextType>;
  Publish_Unpublish?: Publish_UnpublishResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RefreshToken?: RefreshTokenResolvers<ContextType>;
  RegisterUser?: RegisterUserResolvers<ContextType>;
  RegisterUserValidationError?: RegisterUserValidationErrorResolvers<ContextType>;
  RegisteredUser?: RegisteredUserResolvers<ContextType>;
  RegistrationError?: RegistrationErrorResolvers<ContextType>;
  ResetPassword?: ResetPasswordResolvers<ContextType>;
  ResetPasswordValidationError?: ResetPasswordValidationErrorResolvers<ContextType>;
  Response?: ResponseResolvers<ContextType>;
  ServerError?: ServerErrorResolvers<ContextType>;
  SessionIdValidationError?: SessionIdValidationErrorResolvers<ContextType>;
  SinglePost?: SinglePostResolvers<ContextType>;
  UnauthorizedAuthorError?: UnauthorizedAuthorErrorResolvers<ContextType>;
  UnknownError?: UnknownErrorResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserSessionError?: UserSessionErrorResolvers<ContextType>;
  VerifiedResetToken?: VerifiedResetTokenResolvers<ContextType>;
  VerifiedSession?: VerifiedSessionResolvers<ContextType>;
  VerifyResetToken?: VerifyResetTokenResolvers<ContextType>;
  VerifyResetTokenValidationError?: VerifyResetTokenValidationErrorResolvers<ContextType>;
  VerifySession?: VerifySessionResolvers<ContextType>;
}>;

