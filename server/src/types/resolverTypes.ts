import type { GraphQLResolveInfo } from "graphql";
import type { APIContext } from ".";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AccessToken = {
  readonly __typename?: "AccessToken";
  readonly accessToken: Scalars["String"];
  readonly status: Status;
};

export type AuthCookieError = BaseResponse & {
  readonly __typename?: "AuthCookieError";
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type AuthenticationError = BaseResponse & {
  readonly __typename?: "AuthenticationError";
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type BaseResponse = {
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type BinPost =
  | AuthenticationError
  | NotAllowedError
  | NotAllowedPostActionError
  | PostIdValidationError
  | RegistrationError
  | SinglePost
  | UnknownError;

export type BinPosts =
  | AuthenticationError
  | NotAllowedError
  | PostIdsValidationError
  | Posts
  | PostsWarning
  | RegistrationError
  | UnknownError;

export type ChangePassword =
  | AuthenticationError
  | ChangePasswordValidationError
  | NotAllowedError
  | RegistrationError
  | Response
  | ServerError
  | UnknownError;

export type ChangePasswordValidationError = {
  readonly __typename?: "ChangePasswordValidationError";
  readonly confirmNewPasswordError?: Maybe<Scalars["String"]>;
  readonly currentPasswordError?: Maybe<Scalars["String"]>;
  readonly newPasswordError?: Maybe<Scalars["String"]>;
  readonly status: Status;
};

export type CreateDraftPost =
  | AuthenticationError
  | DuplicatePostTitleError
  | ForbiddenError
  | NotAllowedError
  | PostValidationError
  | RegistrationError
  | SinglePost;

export type CreatePostInput = {
  readonly content: Scalars["String"];
  readonly description: Scalars["String"];
  readonly excerpt: Scalars["String"];
  readonly imageBanner?: InputMaybe<Scalars["String"]>;
  readonly tagIds?: InputMaybe<ReadonlyArray<Scalars["ID"]>>;
  readonly title: Scalars["String"];
};

export type CreatePostTags =
  | AuthenticationError
  | CreatePostTagsValidationError
  | CreatedPostTagsWarning
  | DuplicatePostTagError
  | PostTags
  | RegistrationError
  | UnknownError;

export type CreatePostTagsValidationError = {
  readonly __typename?: "CreatePostTagsValidationError";
  readonly status: Status;
  readonly tagsError: Scalars["String"];
};

export type CreateUser =
  | EmailValidationError
  | NotAllowedError
  | Response
  | ServerError;

export type CreatedPostTagsWarning = BaseResponse & {
  readonly __typename?: "CreatedPostTagsWarning";
  readonly message: Scalars["String"];
  readonly status: Status;
  readonly tags: ReadonlyArray<PostTag>;
};

export type DeletePostContentImages =
  | AuthenticationError
  | DeletePostContentImagesValidationError
  | ForbiddenError
  | RegistrationError
  | Response
  | ServerError
  | UnknownError;

export type DeletePostContentImagesValidationError = {
  readonly __typename?: "DeletePostContentImagesValidationError";
  readonly imagesError: Scalars["String"];
  readonly status: Status;
};

export type DeletePostTags =
  | AuthenticationError
  | DeletePostTagsValidationError
  | DeletedPostTags
  | DeletedPostTagsWarning
  | NotAllowedError
  | RegistrationError
  | UnknownError;

export type DeletePostTagsValidationError = {
  readonly __typename?: "DeletePostTagsValidationError";
  readonly status: Status;
  readonly tagIdsError: Scalars["String"];
};

export type DeletedPostTags = {
  readonly __typename?: "DeletedPostTags";
  readonly status: Status;
  readonly tagIds: ReadonlyArray<Scalars["String"]>;
};

export type DeletedPostTagsWarning = BaseResponse & {
  readonly __typename?: "DeletedPostTagsWarning";
  readonly message: Scalars["String"];
  readonly status: Status;
  readonly tagIds: ReadonlyArray<Scalars["String"]>;
};

export type DraftPostInput = {
  readonly content?: InputMaybe<Scalars["String"]>;
  readonly description?: InputMaybe<Scalars["String"]>;
  readonly excerpt?: InputMaybe<Scalars["String"]>;
  readonly imageBanner?: InputMaybe<Scalars["String"]>;
  readonly tagIds?: InputMaybe<ReadonlyArray<Scalars["ID"]>>;
  readonly title: Scalars["String"];
};

export type DuplicatePostTagError = BaseResponse & {
  readonly __typename?: "DuplicatePostTagError";
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type DuplicatePostTitleError = BaseResponse & {
  readonly __typename?: "DuplicatePostTitleError";
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type EditPost =
  | AuthenticationError
  | DuplicatePostTitleError
  | EditPostValidationError
  | ForbiddenError
  | NotAllowedError
  | NotAllowedPostActionError
  | RegistrationError
  | SinglePost
  | UnknownError;

export type EditPostInput = {
  readonly content?: InputMaybe<Scalars["String"]>;
  readonly description?: InputMaybe<Scalars["String"]>;
  readonly editStatus?: InputMaybe<Scalars["Boolean"]>;
  readonly excerpt?: InputMaybe<Scalars["String"]>;
  readonly id: Scalars["ID"];
  readonly imageBanner?: InputMaybe<Scalars["String"]>;
  readonly tagIds?: InputMaybe<ReadonlyArray<Scalars["ID"]>>;
  readonly title: Scalars["String"];
};

export type EditPostTag =
  | AuthenticationError
  | DuplicatePostTagError
  | EditPostTagValidationError
  | EditedPostTag
  | EditedPostTagWarning
  | NotAllowedError
  | RegistrationError
  | UnknownError;

export type EditPostTagValidationError = {
  readonly __typename?: "EditPostTagValidationError";
  readonly nameError?: Maybe<Scalars["String"]>;
  readonly status: Status;
  readonly tagIdError?: Maybe<Scalars["String"]>;
};

export type EditPostValidationError = {
  readonly __typename?: "EditPostValidationError";
  readonly contentError?: Maybe<Scalars["String"]>;
  readonly descriptionError?: Maybe<Scalars["String"]>;
  readonly editStatusError?: Maybe<Scalars["String"]>;
  readonly excerptError?: Maybe<Scalars["String"]>;
  readonly idError?: Maybe<Scalars["String"]>;
  readonly imageBannerError?: Maybe<Scalars["String"]>;
  readonly status: Status;
  readonly tagIdsError?: Maybe<Scalars["String"]>;
  readonly titleError?: Maybe<Scalars["String"]>;
};

export type EditProfile =
  | AuthenticationError
  | EditProfileValidationError
  | EditedProfile
  | RegistrationError
  | UnknownError;

export type EditProfileValidationError = {
  readonly __typename?: "EditProfileValidationError";
  readonly firstNameError?: Maybe<Scalars["String"]>;
  readonly imageError?: Maybe<Scalars["String"]>;
  readonly lastNameError?: Maybe<Scalars["String"]>;
  readonly status: Status;
};

export type EditedPostTag = {
  readonly __typename?: "EditedPostTag";
  readonly status: Status;
  readonly tag: PostTag;
};

export type EditedPostTagWarning = BaseResponse & {
  readonly __typename?: "EditedPostTagWarning";
  readonly message: Scalars["String"];
  readonly status: Status;
  readonly tag: PostTag;
};

export type EditedProfile = UserData & {
  readonly __typename?: "EditedProfile";
  readonly status: Status;
  readonly user: User;
};

export type EmailValidationError = {
  readonly __typename?: "EmailValidationError";
  readonly emailError: Scalars["String"];
  readonly status: Status;
};

export type EmptyBinWarning = BaseResponse & {
  readonly __typename?: "EmptyBinWarning";
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type ForbiddenError = BaseResponse & {
  readonly __typename?: "ForbiddenError";
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type ForgotGeneratePassword =
  | EmailValidationError
  | NotAllowedError
  | RegistrationError
  | Response
  | ServerError;

export type GetPost =
  | AuthenticationError
  | GetPostValidationError
  | NotAllowedError
  | RegistrationError
  | SinglePost
  | UnknownError;

export type GetPostTags =
  | AuthenticationError
  | PostTags
  | RegistrationError
  | UnknownError;

export type GetPostValidationError = {
  readonly __typename?: "GetPostValidationError";
  readonly slugError: Scalars["String"];
  readonly status: Status;
};

export type GetPosts =
  | AuthenticationError
  | ForbiddenError
  | GetPostsData
  | GetPostsValidationError
  | NotAllowedError
  | RegistrationError;

export type GetPostsData = {
  readonly __typename?: "GetPostsData";
  readonly pageData: GetPostsPageData;
  readonly posts: ReadonlyArray<Post>;
  readonly status: Status;
};

export type GetPostsPageData = {
  readonly __typename?: "GetPostsPageData";
  readonly next?: Maybe<Scalars["ID"]>;
  readonly previous?: Maybe<Scalars["ID"]>;
};

export type GetPostsValidationError = {
  readonly __typename?: "GetPostsValidationError";
  readonly afterError?: Maybe<Scalars["String"]>;
  readonly sizeError?: Maybe<Scalars["String"]>;
  readonly sortError?: Maybe<Scalars["String"]>;
  readonly status: Status;
  readonly statusError?: Maybe<Scalars["String"]>;
};

export type LoggedInUser = UserData & {
  readonly __typename?: "LoggedInUser";
  readonly accessToken: Scalars["String"];
  readonly sessionId: Scalars["ID"];
  readonly status: Status;
  readonly user: User;
};

export type Login = LoggedInUser | LoginValidationError | NotAllowedError;

export type LoginValidationError = {
  readonly __typename?: "LoginValidationError";
  readonly emailError?: Maybe<Scalars["String"]>;
  readonly passwordError?: Maybe<Scalars["String"]>;
  readonly status: Status;
};

export type Logout =
  | AuthenticationError
  | NotAllowedError
  | Response
  | SessionIdValidationError
  | UnknownError;

export type Mutation = {
  readonly __typename?: "Mutation";
  readonly binPost: BinPost;
  readonly binPosts: BinPosts;
  readonly changePassword: ChangePassword;
  readonly createPost: CreateDraftPost;
  readonly createPostTags: CreatePostTags;
  readonly createUser: CreateUser;
  readonly deletePostContentImages: DeletePostContentImages;
  readonly deletePostTags: DeletePostTags;
  readonly draftPost: CreateDraftPost;
  readonly editPost: EditPost;
  readonly editPostTag: EditPostTag;
  readonly editProfile: EditProfile;
  readonly forgotPassword: ForgotGeneratePassword;
  readonly generatePassword: ForgotGeneratePassword;
  readonly login: Login;
  readonly logout: Logout;
  readonly refreshToken: RefreshToken;
  readonly registerUser: RegisterUser;
  readonly resetPassword: ResetPassword;
  readonly undoUnpublishPost: UnpublishUndoUnpublishPost;
  readonly unpublishPost: UnpublishUndoUnpublishPost;
  readonly verifyResetToken: VerifyResetToken;
  readonly verifySession: VerifySession;
};

export type MutationBinPostArgs = {
  postId: Scalars["ID"];
};

export type MutationBinPostsArgs = {
  postIds: ReadonlyArray<Scalars["ID"]>;
};

export type MutationChangePasswordArgs = {
  confirmNewPassword: Scalars["String"];
  currentPassword: Scalars["String"];
  newPassword: Scalars["String"];
};

export type MutationCreatePostArgs = {
  post: CreatePostInput;
};

export type MutationCreatePostTagsArgs = {
  tags: ReadonlyArray<Scalars["String"]>;
};

export type MutationCreateUserArgs = {
  email: Scalars["String"];
};

export type MutationDeletePostContentImagesArgs = {
  images: ReadonlyArray<Scalars["String"]>;
};

export type MutationDeletePostTagsArgs = {
  tagIds: ReadonlyArray<Scalars["ID"]>;
};

export type MutationDraftPostArgs = {
  post: DraftPostInput;
};

export type MutationEditPostArgs = {
  post: EditPostInput;
};

export type MutationEditPostTagArgs = {
  name: Scalars["String"];
  tagId: Scalars["ID"];
};

export type MutationEditProfileArgs = {
  firstName: Scalars["String"];
  image?: InputMaybe<Scalars["String"]>;
  lastName: Scalars["String"];
};

export type MutationForgotPasswordArgs = {
  email: Scalars["String"];
};

export type MutationGeneratePasswordArgs = {
  email: Scalars["String"];
};

export type MutationLoginArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type MutationLogoutArgs = {
  sessionId: Scalars["String"];
};

export type MutationRefreshTokenArgs = {
  sessionId: Scalars["String"];
};

export type MutationRegisterUserArgs = {
  userInput: RegisterUserInput;
};

export type MutationResetPasswordArgs = {
  confirmPassword: Scalars["String"];
  password: Scalars["String"];
  token: Scalars["String"];
};

export type MutationUndoUnpublishPostArgs = {
  postId: Scalars["ID"];
};

export type MutationUnpublishPostArgs = {
  postId: Scalars["ID"];
};

export type MutationVerifyResetTokenArgs = {
  token: Scalars["String"];
};

export type MutationVerifySessionArgs = {
  sessionId: Scalars["String"];
};

export type NotAllowedError = BaseResponse & {
  readonly __typename?: "NotAllowedError";
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type NotAllowedPostActionError = BaseResponse & {
  readonly __typename?: "NotAllowedPostActionError";
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type Post = {
  readonly __typename?: "Post";
  readonly author: PostAuthor;
  readonly binnedAt?: Maybe<Scalars["String"]>;
  readonly content?: Maybe<PostContent>;
  readonly dateCreated: Scalars["String"];
  readonly datePublished?: Maybe<Scalars["String"]>;
  readonly description?: Maybe<Scalars["String"]>;
  readonly excerpt?: Maybe<Scalars["String"]>;
  readonly id: Scalars["ID"];
  readonly imageBanner?: Maybe<Scalars["String"]>;
  readonly isBinned: Scalars["Boolean"];
  readonly lastModified?: Maybe<Scalars["String"]>;
  readonly status: PostStatus;
  readonly tags?: Maybe<ReadonlyArray<PostTag>>;
  readonly title: Scalars["String"];
  readonly url: PostUrl;
  readonly views: Scalars["Int"];
};

export type PostAuthor = {
  readonly __typename?: "PostAuthor";
  readonly image?: Maybe<Scalars["String"]>;
  readonly name: Scalars["String"];
};

export type PostContent = {
  readonly __typename?: "PostContent";
  readonly html: Scalars["String"];
  readonly tableOfContents?: Maybe<ReadonlyArray<PostTableOfContents>>;
};

export type PostIdValidationError = {
  readonly __typename?: "PostIdValidationError";
  readonly postIdError: Scalars["String"];
  readonly status: Status;
};

export type PostIdsValidationError = {
  readonly __typename?: "PostIdsValidationError";
  readonly postIdsError: Scalars["String"];
  readonly status: Status;
};

export type PostStatus = "Draft" | "Published" | "Unpublished";

export type PostTableOfContents = {
  readonly __typename?: "PostTableOfContents";
  readonly heading: Scalars["String"];
  readonly href: Scalars["String"];
  readonly level: Scalars["Int"];
};

export type PostTag = {
  readonly __typename?: "PostTag";
  readonly dateCreated: Scalars["String"];
  readonly id: Scalars["ID"];
  readonly lastModified?: Maybe<Scalars["String"]>;
  readonly name: Scalars["String"];
};

export type PostTags = {
  readonly __typename?: "PostTags";
  readonly status: Status;
  readonly tags: ReadonlyArray<PostTag>;
};

export type PostUrl = {
  readonly __typename?: "PostUrl";
  readonly href: Scalars["String"];
  readonly slug: Scalars["String"];
};

export type PostValidationError = {
  readonly __typename?: "PostValidationError";
  readonly contentError?: Maybe<Scalars["String"]>;
  readonly descriptionError?: Maybe<Scalars["String"]>;
  readonly excerptError?: Maybe<Scalars["String"]>;
  readonly imageBannerError?: Maybe<Scalars["String"]>;
  readonly status: Status;
  readonly tagIdsError?: Maybe<Scalars["String"]>;
  readonly titleError?: Maybe<Scalars["String"]>;
};

export type Posts = {
  readonly __typename?: "Posts";
  readonly posts: ReadonlyArray<Post>;
  readonly status: Status;
};

export type PostsWarning = BaseResponse & {
  readonly __typename?: "PostsWarning";
  readonly message: Scalars["String"];
  readonly posts: ReadonlyArray<Post>;
  readonly status: Status;
};

export type Query = {
  readonly __typename?: "Query";
  readonly getPost: GetPost;
  readonly getPostTags: GetPostTags;
  readonly getPosts: GetPosts;
};

export type QueryGetPostArgs = {
  slug: Scalars["String"];
};

export type QueryGetPostsArgs = {
  after?: InputMaybe<Scalars["ID"]>;
  size?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<SortPostsBy>;
  status?: InputMaybe<PostStatus>;
};

export type RefreshToken =
  | AccessToken
  | AuthCookieError
  | ForbiddenError
  | NotAllowedError
  | SessionIdValidationError
  | UnknownError
  | UserSessionError;

export type RegisterUser =
  | AuthenticationError
  | RegisterUserValidationError
  | RegisteredUser
  | RegistrationError
  | UnknownError;

export type RegisterUserInput = {
  readonly confirmPassword: Scalars["String"];
  readonly firstName: Scalars["String"];
  readonly lastName: Scalars["String"];
  readonly password: Scalars["String"];
};

export type RegisterUserValidationError = {
  readonly __typename?: "RegisterUserValidationError";
  readonly confirmPasswordError?: Maybe<Scalars["String"]>;
  readonly firstNameError?: Maybe<Scalars["String"]>;
  readonly lastNameError?: Maybe<Scalars["String"]>;
  readonly passwordError?: Maybe<Scalars["String"]>;
  readonly status: Status;
};

export type RegisteredUser = UserData & {
  readonly __typename?: "RegisteredUser";
  readonly status: Status;
  readonly user: User;
};

export type RegistrationError = BaseResponse & {
  readonly __typename?: "RegistrationError";
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type ResetPassword =
  | NotAllowedError
  | RegistrationError
  | ResetPasswordValidationError
  | Response;

export type ResetPasswordValidationError = {
  readonly __typename?: "ResetPasswordValidationError";
  readonly confirmPasswordError?: Maybe<Scalars["String"]>;
  readonly passwordError?: Maybe<Scalars["String"]>;
  readonly status: Status;
  readonly tokenError?: Maybe<Scalars["String"]>;
};

export type Response = BaseResponse & {
  readonly __typename?: "Response";
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type ServerError = BaseResponse & {
  readonly __typename?: "ServerError";
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type SessionIdValidationError = {
  readonly __typename?: "SessionIdValidationError";
  readonly sessionIdError: Scalars["String"];
  readonly status: Status;
};

export type SinglePost = {
  readonly __typename?: "SinglePost";
  readonly post: Post;
  readonly status: Status;
};

export type SortPostsBy = "date_asc" | "date_desc" | "title_asc" | "title_desc";

export type Status = "ERROR" | "SUCCESS" | "WARN";

export type UnknownError = BaseResponse & {
  readonly __typename?: "UnknownError";
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type UnpublishUndoUnpublishPost =
  | AuthenticationError
  | NotAllowedError
  | NotAllowedPostActionError
  | PostIdValidationError
  | RegistrationError
  | Response
  | SinglePost
  | UnknownError;

export type User = {
  readonly __typename?: "User";
  readonly dateCreated: Scalars["String"];
  readonly email: Scalars["String"];
  readonly firstName?: Maybe<Scalars["String"]>;
  readonly id: Scalars["ID"];
  readonly image?: Maybe<Scalars["String"]>;
  readonly isRegistered: Scalars["Boolean"];
  readonly lastName?: Maybe<Scalars["String"]>;
};

export type UserData = {
  readonly status: Status;
  readonly user: User;
};

export type UserSessionError = BaseResponse & {
  readonly __typename?: "UserSessionError";
  readonly message: Scalars["String"];
  readonly status: Status;
};

export type VerifiedResetToken = {
  readonly __typename?: "VerifiedResetToken";
  readonly email: Scalars["String"];
  readonly resetToken: Scalars["String"];
  readonly status: Status;
};

export type VerifiedSession = UserData & {
  readonly __typename?: "VerifiedSession";
  readonly accessToken: Scalars["String"];
  readonly status: Status;
  readonly user: User;
};

export type VerifyResetToken =
  | NotAllowedError
  | RegistrationError
  | VerifiedResetToken
  | VerifyResetTokenValidationError;

export type VerifyResetTokenValidationError = {
  readonly __typename?: "VerifyResetTokenValidationError";
  readonly status: Status;
  readonly tokenError: Scalars["String"];
};

export type VerifySession =
  | AuthCookieError
  | ForbiddenError
  | NotAllowedError
  | SessionIdValidationError
  | UnknownError
  | VerifiedSession;

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AccessToken: ResolverTypeWrapper<AccessToken>;
  AuthCookieError: ResolverTypeWrapper<AuthCookieError>;
  AuthenticationError: ResolverTypeWrapper<AuthenticationError>;
  BaseResponse:
    | ResolversTypes["AuthCookieError"]
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["CreatedPostTagsWarning"]
    | ResolversTypes["DeletedPostTagsWarning"]
    | ResolversTypes["DuplicatePostTagError"]
    | ResolversTypes["DuplicatePostTitleError"]
    | ResolversTypes["EditedPostTagWarning"]
    | ResolversTypes["EmptyBinWarning"]
    | ResolversTypes["ForbiddenError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["NotAllowedPostActionError"]
    | ResolversTypes["PostsWarning"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["Response"]
    | ResolversTypes["ServerError"]
    | ResolversTypes["UnknownError"]
    | ResolversTypes["UserSessionError"];
  BinPost:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["NotAllowedPostActionError"]
    | ResolversTypes["PostIdValidationError"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["SinglePost"]
    | ResolversTypes["UnknownError"];
  BinPosts:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["PostIdsValidationError"]
    | ResolversTypes["Posts"]
    | ResolversTypes["PostsWarning"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["UnknownError"];
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  ChangePassword:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["ChangePasswordValidationError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["Response"]
    | ResolversTypes["ServerError"]
    | ResolversTypes["UnknownError"];
  ChangePasswordValidationError: ResolverTypeWrapper<ChangePasswordValidationError>;
  CreateDraftPost:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["DuplicatePostTitleError"]
    | ResolversTypes["ForbiddenError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["PostValidationError"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["SinglePost"];
  CreatePostInput: CreatePostInput;
  CreatePostTags:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["CreatePostTagsValidationError"]
    | ResolversTypes["CreatedPostTagsWarning"]
    | ResolversTypes["DuplicatePostTagError"]
    | ResolversTypes["PostTags"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["UnknownError"];
  CreatePostTagsValidationError: ResolverTypeWrapper<CreatePostTagsValidationError>;
  CreateUser:
    | ResolversTypes["EmailValidationError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["Response"]
    | ResolversTypes["ServerError"];
  CreatedPostTagsWarning: ResolverTypeWrapper<CreatedPostTagsWarning>;
  DeletePostContentImages:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["DeletePostContentImagesValidationError"]
    | ResolversTypes["ForbiddenError"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["Response"]
    | ResolversTypes["ServerError"]
    | ResolversTypes["UnknownError"];
  DeletePostContentImagesValidationError: ResolverTypeWrapper<DeletePostContentImagesValidationError>;
  DeletePostTags:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["DeletePostTagsValidationError"]
    | ResolversTypes["DeletedPostTags"]
    | ResolversTypes["DeletedPostTagsWarning"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["UnknownError"];
  DeletePostTagsValidationError: ResolverTypeWrapper<DeletePostTagsValidationError>;
  DeletedPostTags: ResolverTypeWrapper<DeletedPostTags>;
  DeletedPostTagsWarning: ResolverTypeWrapper<DeletedPostTagsWarning>;
  DraftPostInput: DraftPostInput;
  DuplicatePostTagError: ResolverTypeWrapper<DuplicatePostTagError>;
  DuplicatePostTitleError: ResolverTypeWrapper<DuplicatePostTitleError>;
  EditPost:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["DuplicatePostTitleError"]
    | ResolversTypes["EditPostValidationError"]
    | ResolversTypes["ForbiddenError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["NotAllowedPostActionError"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["SinglePost"]
    | ResolversTypes["UnknownError"];
  EditPostInput: EditPostInput;
  EditPostTag:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["DuplicatePostTagError"]
    | ResolversTypes["EditPostTagValidationError"]
    | ResolversTypes["EditedPostTag"]
    | ResolversTypes["EditedPostTagWarning"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["UnknownError"];
  EditPostTagValidationError: ResolverTypeWrapper<EditPostTagValidationError>;
  EditPostValidationError: ResolverTypeWrapper<EditPostValidationError>;
  EditProfile:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["EditProfileValidationError"]
    | ResolversTypes["EditedProfile"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["UnknownError"];
  EditProfileValidationError: ResolverTypeWrapper<EditProfileValidationError>;
  EditedPostTag: ResolverTypeWrapper<EditedPostTag>;
  EditedPostTagWarning: ResolverTypeWrapper<EditedPostTagWarning>;
  EditedProfile: ResolverTypeWrapper<EditedProfile>;
  EmailValidationError: ResolverTypeWrapper<EmailValidationError>;
  EmptyBinWarning: ResolverTypeWrapper<EmptyBinWarning>;
  ForbiddenError: ResolverTypeWrapper<ForbiddenError>;
  ForgotGeneratePassword:
    | ResolversTypes["EmailValidationError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["Response"]
    | ResolversTypes["ServerError"];
  GetPost:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["GetPostValidationError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["SinglePost"]
    | ResolversTypes["UnknownError"];
  GetPostTags:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["PostTags"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["UnknownError"];
  GetPostValidationError: ResolverTypeWrapper<GetPostValidationError>;
  GetPosts:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["ForbiddenError"]
    | ResolversTypes["GetPostsData"]
    | ResolversTypes["GetPostsValidationError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["RegistrationError"];
  GetPostsData: ResolverTypeWrapper<GetPostsData>;
  GetPostsPageData: ResolverTypeWrapper<GetPostsPageData>;
  GetPostsValidationError: ResolverTypeWrapper<GetPostsValidationError>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  LoggedInUser: ResolverTypeWrapper<LoggedInUser>;
  Login:
    | ResolversTypes["LoggedInUser"]
    | ResolversTypes["LoginValidationError"]
    | ResolversTypes["NotAllowedError"];
  LoginValidationError: ResolverTypeWrapper<LoginValidationError>;
  Logout:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["Response"]
    | ResolversTypes["SessionIdValidationError"]
    | ResolversTypes["UnknownError"];
  Mutation: ResolverTypeWrapper<{}>;
  NotAllowedError: ResolverTypeWrapper<NotAllowedError>;
  NotAllowedPostActionError: ResolverTypeWrapper<NotAllowedPostActionError>;
  Post: ResolverTypeWrapper<Post>;
  PostAuthor: ResolverTypeWrapper<PostAuthor>;
  PostContent: ResolverTypeWrapper<PostContent>;
  PostIdValidationError: ResolverTypeWrapper<PostIdValidationError>;
  PostIdsValidationError: ResolverTypeWrapper<PostIdsValidationError>;
  PostStatus: PostStatus;
  PostTableOfContents: ResolverTypeWrapper<PostTableOfContents>;
  PostTag: ResolverTypeWrapper<PostTag>;
  PostTags: ResolverTypeWrapper<PostTags>;
  PostUrl: ResolverTypeWrapper<PostUrl>;
  PostValidationError: ResolverTypeWrapper<PostValidationError>;
  Posts: ResolverTypeWrapper<Posts>;
  PostsWarning: ResolverTypeWrapper<PostsWarning>;
  Query: ResolverTypeWrapper<{}>;
  RefreshToken:
    | ResolversTypes["AccessToken"]
    | ResolversTypes["AuthCookieError"]
    | ResolversTypes["ForbiddenError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["SessionIdValidationError"]
    | ResolversTypes["UnknownError"]
    | ResolversTypes["UserSessionError"];
  RegisterUser:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["RegisterUserValidationError"]
    | ResolversTypes["RegisteredUser"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["UnknownError"];
  RegisterUserInput: RegisterUserInput;
  RegisterUserValidationError: ResolverTypeWrapper<RegisterUserValidationError>;
  RegisteredUser: ResolverTypeWrapper<RegisteredUser>;
  RegistrationError: ResolverTypeWrapper<RegistrationError>;
  ResetPassword:
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["ResetPasswordValidationError"]
    | ResolversTypes["Response"];
  ResetPasswordValidationError: ResolverTypeWrapper<ResetPasswordValidationError>;
  Response: ResolverTypeWrapper<Response>;
  ServerError: ResolverTypeWrapper<ServerError>;
  SessionIdValidationError: ResolverTypeWrapper<SessionIdValidationError>;
  SinglePost: ResolverTypeWrapper<SinglePost>;
  SortPostsBy: SortPostsBy;
  Status: Status;
  String: ResolverTypeWrapper<Scalars["String"]>;
  UnknownError: ResolverTypeWrapper<UnknownError>;
  UnpublishUndoUnpublishPost:
    | ResolversTypes["AuthenticationError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["NotAllowedPostActionError"]
    | ResolversTypes["PostIdValidationError"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["Response"]
    | ResolversTypes["SinglePost"]
    | ResolversTypes["UnknownError"];
  User: ResolverTypeWrapper<User>;
  UserData:
    | ResolversTypes["EditedProfile"]
    | ResolversTypes["LoggedInUser"]
    | ResolversTypes["RegisteredUser"]
    | ResolversTypes["VerifiedSession"];
  UserSessionError: ResolverTypeWrapper<UserSessionError>;
  VerifiedResetToken: ResolverTypeWrapper<VerifiedResetToken>;
  VerifiedSession: ResolverTypeWrapper<VerifiedSession>;
  VerifyResetToken:
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["RegistrationError"]
    | ResolversTypes["VerifiedResetToken"]
    | ResolversTypes["VerifyResetTokenValidationError"];
  VerifyResetTokenValidationError: ResolverTypeWrapper<VerifyResetTokenValidationError>;
  VerifySession:
    | ResolversTypes["AuthCookieError"]
    | ResolversTypes["ForbiddenError"]
    | ResolversTypes["NotAllowedError"]
    | ResolversTypes["SessionIdValidationError"]
    | ResolversTypes["UnknownError"]
    | ResolversTypes["VerifiedSession"];
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccessToken: AccessToken;
  AuthCookieError: AuthCookieError;
  AuthenticationError: AuthenticationError;
  BaseResponse:
    | ResolversParentTypes["AuthCookieError"]
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["CreatedPostTagsWarning"]
    | ResolversParentTypes["DeletedPostTagsWarning"]
    | ResolversParentTypes["DuplicatePostTagError"]
    | ResolversParentTypes["DuplicatePostTitleError"]
    | ResolversParentTypes["EditedPostTagWarning"]
    | ResolversParentTypes["EmptyBinWarning"]
    | ResolversParentTypes["ForbiddenError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["NotAllowedPostActionError"]
    | ResolversParentTypes["PostsWarning"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["Response"]
    | ResolversParentTypes["ServerError"]
    | ResolversParentTypes["UnknownError"]
    | ResolversParentTypes["UserSessionError"];
  BinPost:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["NotAllowedPostActionError"]
    | ResolversParentTypes["PostIdValidationError"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["SinglePost"]
    | ResolversParentTypes["UnknownError"];
  BinPosts:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["PostIdsValidationError"]
    | ResolversParentTypes["Posts"]
    | ResolversParentTypes["PostsWarning"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["UnknownError"];
  Boolean: Scalars["Boolean"];
  ChangePassword:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["ChangePasswordValidationError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["Response"]
    | ResolversParentTypes["ServerError"]
    | ResolversParentTypes["UnknownError"];
  ChangePasswordValidationError: ChangePasswordValidationError;
  CreateDraftPost:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["DuplicatePostTitleError"]
    | ResolversParentTypes["ForbiddenError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["PostValidationError"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["SinglePost"];
  CreatePostInput: CreatePostInput;
  CreatePostTags:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["CreatePostTagsValidationError"]
    | ResolversParentTypes["CreatedPostTagsWarning"]
    | ResolversParentTypes["DuplicatePostTagError"]
    | ResolversParentTypes["PostTags"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["UnknownError"];
  CreatePostTagsValidationError: CreatePostTagsValidationError;
  CreateUser:
    | ResolversParentTypes["EmailValidationError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["Response"]
    | ResolversParentTypes["ServerError"];
  CreatedPostTagsWarning: CreatedPostTagsWarning;
  DeletePostContentImages:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["DeletePostContentImagesValidationError"]
    | ResolversParentTypes["ForbiddenError"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["Response"]
    | ResolversParentTypes["ServerError"]
    | ResolversParentTypes["UnknownError"];
  DeletePostContentImagesValidationError: DeletePostContentImagesValidationError;
  DeletePostTags:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["DeletePostTagsValidationError"]
    | ResolversParentTypes["DeletedPostTags"]
    | ResolversParentTypes["DeletedPostTagsWarning"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["UnknownError"];
  DeletePostTagsValidationError: DeletePostTagsValidationError;
  DeletedPostTags: DeletedPostTags;
  DeletedPostTagsWarning: DeletedPostTagsWarning;
  DraftPostInput: DraftPostInput;
  DuplicatePostTagError: DuplicatePostTagError;
  DuplicatePostTitleError: DuplicatePostTitleError;
  EditPost:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["DuplicatePostTitleError"]
    | ResolversParentTypes["EditPostValidationError"]
    | ResolversParentTypes["ForbiddenError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["NotAllowedPostActionError"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["SinglePost"]
    | ResolversParentTypes["UnknownError"];
  EditPostInput: EditPostInput;
  EditPostTag:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["DuplicatePostTagError"]
    | ResolversParentTypes["EditPostTagValidationError"]
    | ResolversParentTypes["EditedPostTag"]
    | ResolversParentTypes["EditedPostTagWarning"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["UnknownError"];
  EditPostTagValidationError: EditPostTagValidationError;
  EditPostValidationError: EditPostValidationError;
  EditProfile:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["EditProfileValidationError"]
    | ResolversParentTypes["EditedProfile"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["UnknownError"];
  EditProfileValidationError: EditProfileValidationError;
  EditedPostTag: EditedPostTag;
  EditedPostTagWarning: EditedPostTagWarning;
  EditedProfile: EditedProfile;
  EmailValidationError: EmailValidationError;
  EmptyBinWarning: EmptyBinWarning;
  ForbiddenError: ForbiddenError;
  ForgotGeneratePassword:
    | ResolversParentTypes["EmailValidationError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["Response"]
    | ResolversParentTypes["ServerError"];
  GetPost:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["GetPostValidationError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["SinglePost"]
    | ResolversParentTypes["UnknownError"];
  GetPostTags:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["PostTags"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["UnknownError"];
  GetPostValidationError: GetPostValidationError;
  GetPosts:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["ForbiddenError"]
    | ResolversParentTypes["GetPostsData"]
    | ResolversParentTypes["GetPostsValidationError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["RegistrationError"];
  GetPostsData: GetPostsData;
  GetPostsPageData: GetPostsPageData;
  GetPostsValidationError: GetPostsValidationError;
  ID: Scalars["ID"];
  Int: Scalars["Int"];
  LoggedInUser: LoggedInUser;
  Login:
    | ResolversParentTypes["LoggedInUser"]
    | ResolversParentTypes["LoginValidationError"]
    | ResolversParentTypes["NotAllowedError"];
  LoginValidationError: LoginValidationError;
  Logout:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["Response"]
    | ResolversParentTypes["SessionIdValidationError"]
    | ResolversParentTypes["UnknownError"];
  Mutation: {};
  NotAllowedError: NotAllowedError;
  NotAllowedPostActionError: NotAllowedPostActionError;
  Post: Post;
  PostAuthor: PostAuthor;
  PostContent: PostContent;
  PostIdValidationError: PostIdValidationError;
  PostIdsValidationError: PostIdsValidationError;
  PostTableOfContents: PostTableOfContents;
  PostTag: PostTag;
  PostTags: PostTags;
  PostUrl: PostUrl;
  PostValidationError: PostValidationError;
  Posts: Posts;
  PostsWarning: PostsWarning;
  Query: {};
  RefreshToken:
    | ResolversParentTypes["AccessToken"]
    | ResolversParentTypes["AuthCookieError"]
    | ResolversParentTypes["ForbiddenError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["SessionIdValidationError"]
    | ResolversParentTypes["UnknownError"]
    | ResolversParentTypes["UserSessionError"];
  RegisterUser:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["RegisterUserValidationError"]
    | ResolversParentTypes["RegisteredUser"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["UnknownError"];
  RegisterUserInput: RegisterUserInput;
  RegisterUserValidationError: RegisterUserValidationError;
  RegisteredUser: RegisteredUser;
  RegistrationError: RegistrationError;
  ResetPassword:
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["ResetPasswordValidationError"]
    | ResolversParentTypes["Response"];
  ResetPasswordValidationError: ResetPasswordValidationError;
  Response: Response;
  ServerError: ServerError;
  SessionIdValidationError: SessionIdValidationError;
  SinglePost: SinglePost;
  String: Scalars["String"];
  UnknownError: UnknownError;
  UnpublishUndoUnpublishPost:
    | ResolversParentTypes["AuthenticationError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["NotAllowedPostActionError"]
    | ResolversParentTypes["PostIdValidationError"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["Response"]
    | ResolversParentTypes["SinglePost"]
    | ResolversParentTypes["UnknownError"];
  User: User;
  UserData:
    | ResolversParentTypes["EditedProfile"]
    | ResolversParentTypes["LoggedInUser"]
    | ResolversParentTypes["RegisteredUser"]
    | ResolversParentTypes["VerifiedSession"];
  UserSessionError: UserSessionError;
  VerifiedResetToken: VerifiedResetToken;
  VerifiedSession: VerifiedSession;
  VerifyResetToken:
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["RegistrationError"]
    | ResolversParentTypes["VerifiedResetToken"]
    | ResolversParentTypes["VerifyResetTokenValidationError"];
  VerifyResetTokenValidationError: VerifyResetTokenValidationError;
  VerifySession:
    | ResolversParentTypes["AuthCookieError"]
    | ResolversParentTypes["ForbiddenError"]
    | ResolversParentTypes["NotAllowedError"]
    | ResolversParentTypes["SessionIdValidationError"]
    | ResolversParentTypes["UnknownError"]
    | ResolversParentTypes["VerifiedSession"];
}>;

export type AccessTokenResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["AccessToken"] = ResolversParentTypes["AccessToken"]
> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthCookieErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["AuthCookieError"] = ResolversParentTypes["AuthCookieError"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthenticationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["AuthenticationError"] = ResolversParentTypes["AuthenticationError"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BaseResponseResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["BaseResponse"] = ResolversParentTypes["BaseResponse"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthCookieError"
    | "AuthenticationError"
    | "CreatedPostTagsWarning"
    | "DeletedPostTagsWarning"
    | "DuplicatePostTagError"
    | "DuplicatePostTitleError"
    | "EditedPostTagWarning"
    | "EmptyBinWarning"
    | "ForbiddenError"
    | "NotAllowedError"
    | "NotAllowedPostActionError"
    | "PostsWarning"
    | "RegistrationError"
    | "Response"
    | "ServerError"
    | "UnknownError"
    | "UserSessionError",
    ParentType,
    ContextType
  >;
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
}>;

export type BinPostResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["BinPost"] = ResolversParentTypes["BinPost"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "NotAllowedError"
    | "NotAllowedPostActionError"
    | "PostIdValidationError"
    | "RegistrationError"
    | "SinglePost"
    | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type BinPostsResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["BinPosts"] = ResolversParentTypes["BinPosts"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "NotAllowedError"
    | "PostIdsValidationError"
    | "Posts"
    | "PostsWarning"
    | "RegistrationError"
    | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type ChangePasswordResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["ChangePassword"] = ResolversParentTypes["ChangePassword"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "ChangePasswordValidationError"
    | "NotAllowedError"
    | "RegistrationError"
    | "Response"
    | "ServerError"
    | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type ChangePasswordValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["ChangePasswordValidationError"] = ResolversParentTypes["ChangePasswordValidationError"]
> = ResolversObject<{
  confirmNewPasswordError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  currentPasswordError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  newPasswordError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateDraftPostResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["CreateDraftPost"] = ResolversParentTypes["CreateDraftPost"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "DuplicatePostTitleError"
    | "ForbiddenError"
    | "NotAllowedError"
    | "PostValidationError"
    | "RegistrationError"
    | "SinglePost",
    ParentType,
    ContextType
  >;
}>;

export type CreatePostTagsResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["CreatePostTags"] = ResolversParentTypes["CreatePostTags"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "CreatePostTagsValidationError"
    | "CreatedPostTagsWarning"
    | "DuplicatePostTagError"
    | "PostTags"
    | "RegistrationError"
    | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type CreatePostTagsValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["CreatePostTagsValidationError"] = ResolversParentTypes["CreatePostTagsValidationError"]
> = ResolversObject<{
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  tagsError?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateUserResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["CreateUser"] = ResolversParentTypes["CreateUser"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "EmailValidationError" | "NotAllowedError" | "Response" | "ServerError",
    ParentType,
    ContextType
  >;
}>;

export type CreatedPostTagsWarningResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["CreatedPostTagsWarning"] = ResolversParentTypes["CreatedPostTagsWarning"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  tags?: Resolver<
    ReadonlyArray<ResolversTypes["PostTag"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeletePostContentImagesResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["DeletePostContentImages"] = ResolversParentTypes["DeletePostContentImages"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "DeletePostContentImagesValidationError"
    | "ForbiddenError"
    | "RegistrationError"
    | "Response"
    | "ServerError"
    | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type DeletePostContentImagesValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["DeletePostContentImagesValidationError"] = ResolversParentTypes["DeletePostContentImagesValidationError"]
> = ResolversObject<{
  imagesError?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeletePostTagsResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["DeletePostTags"] = ResolversParentTypes["DeletePostTags"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "DeletePostTagsValidationError"
    | "DeletedPostTags"
    | "DeletedPostTagsWarning"
    | "NotAllowedError"
    | "RegistrationError"
    | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type DeletePostTagsValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["DeletePostTagsValidationError"] = ResolversParentTypes["DeletePostTagsValidationError"]
> = ResolversObject<{
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  tagIdsError?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeletedPostTagsResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["DeletedPostTags"] = ResolversParentTypes["DeletedPostTags"]
> = ResolversObject<{
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  tagIds?: Resolver<
    ReadonlyArray<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeletedPostTagsWarningResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["DeletedPostTagsWarning"] = ResolversParentTypes["DeletedPostTagsWarning"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  tagIds?: Resolver<
    ReadonlyArray<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DuplicatePostTagErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["DuplicatePostTagError"] = ResolversParentTypes["DuplicatePostTagError"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DuplicatePostTitleErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["DuplicatePostTitleError"] = ResolversParentTypes["DuplicatePostTitleError"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditPostResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["EditPost"] = ResolversParentTypes["EditPost"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "DuplicatePostTitleError"
    | "EditPostValidationError"
    | "ForbiddenError"
    | "NotAllowedError"
    | "NotAllowedPostActionError"
    | "RegistrationError"
    | "SinglePost"
    | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type EditPostTagResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["EditPostTag"] = ResolversParentTypes["EditPostTag"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "DuplicatePostTagError"
    | "EditPostTagValidationError"
    | "EditedPostTag"
    | "EditedPostTagWarning"
    | "NotAllowedError"
    | "RegistrationError"
    | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type EditPostTagValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["EditPostTagValidationError"] = ResolversParentTypes["EditPostTagValidationError"]
> = ResolversObject<{
  nameError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  tagIdError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditPostValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["EditPostValidationError"] = ResolversParentTypes["EditPostValidationError"]
> = ResolversObject<{
  contentError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  descriptionError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  editStatusError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  excerptError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  idError?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  imageBannerError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  tagIdsError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  titleError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditProfileResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["EditProfile"] = ResolversParentTypes["EditProfile"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "EditProfileValidationError"
    | "EditedProfile"
    | "RegistrationError"
    | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type EditProfileValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["EditProfileValidationError"] = ResolversParentTypes["EditProfileValidationError"]
> = ResolversObject<{
  firstNameError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  imageError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  lastNameError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditedPostTagResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["EditedPostTag"] = ResolversParentTypes["EditedPostTag"]
> = ResolversObject<{
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  tag?: Resolver<ResolversTypes["PostTag"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditedPostTagWarningResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["EditedPostTagWarning"] = ResolversParentTypes["EditedPostTagWarning"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  tag?: Resolver<ResolversTypes["PostTag"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditedProfileResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["EditedProfile"] = ResolversParentTypes["EditedProfile"]
> = ResolversObject<{
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmailValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["EmailValidationError"] = ResolversParentTypes["EmailValidationError"]
> = ResolversObject<{
  emailError?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmptyBinWarningResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["EmptyBinWarning"] = ResolversParentTypes["EmptyBinWarning"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ForbiddenErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["ForbiddenError"] = ResolversParentTypes["ForbiddenError"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ForgotGeneratePasswordResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["ForgotGeneratePassword"] = ResolversParentTypes["ForgotGeneratePassword"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "EmailValidationError"
    | "NotAllowedError"
    | "RegistrationError"
    | "Response"
    | "ServerError",
    ParentType,
    ContextType
  >;
}>;

export type GetPostResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["GetPost"] = ResolversParentTypes["GetPost"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "GetPostValidationError"
    | "NotAllowedError"
    | "RegistrationError"
    | "SinglePost"
    | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type GetPostTagsResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["GetPostTags"] = ResolversParentTypes["GetPostTags"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "AuthenticationError" | "PostTags" | "RegistrationError" | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type GetPostValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["GetPostValidationError"] = ResolversParentTypes["GetPostValidationError"]
> = ResolversObject<{
  slugError?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GetPostsResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["GetPosts"] = ResolversParentTypes["GetPosts"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "ForbiddenError"
    | "GetPostsData"
    | "GetPostsValidationError"
    | "NotAllowedError"
    | "RegistrationError",
    ParentType,
    ContextType
  >;
}>;

export type GetPostsDataResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["GetPostsData"] = ResolversParentTypes["GetPostsData"]
> = ResolversObject<{
  pageData?: Resolver<
    ResolversTypes["GetPostsPageData"],
    ParentType,
    ContextType
  >;
  posts?: Resolver<
    ReadonlyArray<ResolversTypes["Post"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GetPostsPageDataResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["GetPostsPageData"] = ResolversParentTypes["GetPostsPageData"]
> = ResolversObject<{
  next?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  previous?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GetPostsValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["GetPostsValidationError"] = ResolversParentTypes["GetPostsValidationError"]
> = ResolversObject<{
  afterError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  sizeError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  sortError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  statusError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoggedInUserResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["LoggedInUser"] = ResolversParentTypes["LoggedInUser"]
> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  sessionId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["Login"] = ResolversParentTypes["Login"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "LoggedInUser" | "LoginValidationError" | "NotAllowedError",
    ParentType,
    ContextType
  >;
}>;

export type LoginValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["LoginValidationError"] = ResolversParentTypes["LoginValidationError"]
> = ResolversObject<{
  emailError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  passwordError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LogoutResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["Logout"] = ResolversParentTypes["Logout"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "NotAllowedError"
    | "Response"
    | "SessionIdValidationError"
    | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type MutationResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = ResolversObject<{
  binPost?: Resolver<
    ResolversTypes["BinPost"],
    ParentType,
    ContextType,
    RequireFields<MutationBinPostArgs, "postId">
  >;
  binPosts?: Resolver<
    ResolversTypes["BinPosts"],
    ParentType,
    ContextType,
    RequireFields<MutationBinPostsArgs, "postIds">
  >;
  changePassword?: Resolver<
    ResolversTypes["ChangePassword"],
    ParentType,
    ContextType,
    RequireFields<
      MutationChangePasswordArgs,
      "confirmNewPassword" | "currentPassword" | "newPassword"
    >
  >;
  createPost?: Resolver<
    ResolversTypes["CreateDraftPost"],
    ParentType,
    ContextType,
    RequireFields<MutationCreatePostArgs, "post">
  >;
  createPostTags?: Resolver<
    ResolversTypes["CreatePostTags"],
    ParentType,
    ContextType,
    RequireFields<MutationCreatePostTagsArgs, "tags">
  >;
  createUser?: Resolver<
    ResolversTypes["CreateUser"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, "email">
  >;
  deletePostContentImages?: Resolver<
    ResolversTypes["DeletePostContentImages"],
    ParentType,
    ContextType,
    RequireFields<MutationDeletePostContentImagesArgs, "images">
  >;
  deletePostTags?: Resolver<
    ResolversTypes["DeletePostTags"],
    ParentType,
    ContextType,
    RequireFields<MutationDeletePostTagsArgs, "tagIds">
  >;
  draftPost?: Resolver<
    ResolversTypes["CreateDraftPost"],
    ParentType,
    ContextType,
    RequireFields<MutationDraftPostArgs, "post">
  >;
  editPost?: Resolver<
    ResolversTypes["EditPost"],
    ParentType,
    ContextType,
    RequireFields<MutationEditPostArgs, "post">
  >;
  editPostTag?: Resolver<
    ResolversTypes["EditPostTag"],
    ParentType,
    ContextType,
    RequireFields<MutationEditPostTagArgs, "name" | "tagId">
  >;
  editProfile?: Resolver<
    ResolversTypes["EditProfile"],
    ParentType,
    ContextType,
    RequireFields<MutationEditProfileArgs, "firstName" | "lastName">
  >;
  forgotPassword?: Resolver<
    ResolversTypes["ForgotGeneratePassword"],
    ParentType,
    ContextType,
    RequireFields<MutationForgotPasswordArgs, "email">
  >;
  generatePassword?: Resolver<
    ResolversTypes["ForgotGeneratePassword"],
    ParentType,
    ContextType,
    RequireFields<MutationGeneratePasswordArgs, "email">
  >;
  login?: Resolver<
    ResolversTypes["Login"],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "email" | "password">
  >;
  logout?: Resolver<
    ResolversTypes["Logout"],
    ParentType,
    ContextType,
    RequireFields<MutationLogoutArgs, "sessionId">
  >;
  refreshToken?: Resolver<
    ResolversTypes["RefreshToken"],
    ParentType,
    ContextType,
    RequireFields<MutationRefreshTokenArgs, "sessionId">
  >;
  registerUser?: Resolver<
    ResolversTypes["RegisterUser"],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterUserArgs, "userInput">
  >;
  resetPassword?: Resolver<
    ResolversTypes["ResetPassword"],
    ParentType,
    ContextType,
    RequireFields<
      MutationResetPasswordArgs,
      "confirmPassword" | "password" | "token"
    >
  >;
  undoUnpublishPost?: Resolver<
    ResolversTypes["UnpublishUndoUnpublishPost"],
    ParentType,
    ContextType,
    RequireFields<MutationUndoUnpublishPostArgs, "postId">
  >;
  unpublishPost?: Resolver<
    ResolversTypes["UnpublishUndoUnpublishPost"],
    ParentType,
    ContextType,
    RequireFields<MutationUnpublishPostArgs, "postId">
  >;
  verifyResetToken?: Resolver<
    ResolversTypes["VerifyResetToken"],
    ParentType,
    ContextType,
    RequireFields<MutationVerifyResetTokenArgs, "token">
  >;
  verifySession?: Resolver<
    ResolversTypes["VerifySession"],
    ParentType,
    ContextType,
    RequireFields<MutationVerifySessionArgs, "sessionId">
  >;
}>;

export type NotAllowedErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["NotAllowedError"] = ResolversParentTypes["NotAllowedError"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NotAllowedPostActionErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["NotAllowedPostActionError"] = ResolversParentTypes["NotAllowedPostActionError"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["Post"] = ResolversParentTypes["Post"]
> = ResolversObject<{
  author?: Resolver<ResolversTypes["PostAuthor"], ParentType, ContextType>;
  binnedAt?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  content?: Resolver<
    Maybe<ResolversTypes["PostContent"]>,
    ParentType,
    ContextType
  >;
  dateCreated?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  datePublished?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  excerpt?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  imageBanner?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  isBinned?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  lastModified?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["PostStatus"], ParentType, ContextType>;
  tags?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes["PostTag"]>>,
    ParentType,
    ContextType
  >;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  url?: Resolver<ResolversTypes["PostUrl"], ParentType, ContextType>;
  views?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostAuthorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["PostAuthor"] = ResolversParentTypes["PostAuthor"]
> = ResolversObject<{
  image?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostContentResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["PostContent"] = ResolversParentTypes["PostContent"]
> = ResolversObject<{
  html?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  tableOfContents?: Resolver<
    Maybe<ReadonlyArray<ResolversTypes["PostTableOfContents"]>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostIdValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["PostIdValidationError"] = ResolversParentTypes["PostIdValidationError"]
> = ResolversObject<{
  postIdError?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostIdsValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["PostIdsValidationError"] = ResolversParentTypes["PostIdsValidationError"]
> = ResolversObject<{
  postIdsError?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostTableOfContentsResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["PostTableOfContents"] = ResolversParentTypes["PostTableOfContents"]
> = ResolversObject<{
  heading?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  href?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  level?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostTagResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["PostTag"] = ResolversParentTypes["PostTag"]
> = ResolversObject<{
  dateCreated?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  lastModified?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostTagsResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["PostTags"] = ResolversParentTypes["PostTags"]
> = ResolversObject<{
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  tags?: Resolver<
    ReadonlyArray<ResolversTypes["PostTag"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostUrlResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["PostUrl"] = ResolversParentTypes["PostUrl"]
> = ResolversObject<{
  href?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["PostValidationError"] = ResolversParentTypes["PostValidationError"]
> = ResolversObject<{
  contentError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  descriptionError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  excerptError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  imageBannerError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  tagIdsError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  titleError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostsResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["Posts"] = ResolversParentTypes["Posts"]
> = ResolversObject<{
  posts?: Resolver<
    ReadonlyArray<ResolversTypes["Post"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostsWarningResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["PostsWarning"] = ResolversParentTypes["PostsWarning"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  posts?: Resolver<
    ReadonlyArray<ResolversTypes["Post"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = ResolversObject<{
  getPost?: Resolver<
    ResolversTypes["GetPost"],
    ParentType,
    ContextType,
    RequireFields<QueryGetPostArgs, "slug">
  >;
  getPostTags?: Resolver<
    ResolversTypes["GetPostTags"],
    ParentType,
    ContextType
  >;
  getPosts?: Resolver<
    ResolversTypes["GetPosts"],
    ParentType,
    ContextType,
    Partial<QueryGetPostsArgs>
  >;
}>;

export type RefreshTokenResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["RefreshToken"] = ResolversParentTypes["RefreshToken"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AccessToken"
    | "AuthCookieError"
    | "ForbiddenError"
    | "NotAllowedError"
    | "SessionIdValidationError"
    | "UnknownError"
    | "UserSessionError",
    ParentType,
    ContextType
  >;
}>;

export type RegisterUserResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["RegisterUser"] = ResolversParentTypes["RegisterUser"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "RegisterUserValidationError"
    | "RegisteredUser"
    | "RegistrationError"
    | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type RegisterUserValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["RegisterUserValidationError"] = ResolversParentTypes["RegisterUserValidationError"]
> = ResolversObject<{
  confirmPasswordError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  firstNameError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  lastNameError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  passwordError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegisteredUserResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["RegisteredUser"] = ResolversParentTypes["RegisteredUser"]
> = ResolversObject<{
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegistrationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["RegistrationError"] = ResolversParentTypes["RegistrationError"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ResetPasswordResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["ResetPassword"] = ResolversParentTypes["ResetPassword"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "NotAllowedError"
    | "RegistrationError"
    | "ResetPasswordValidationError"
    | "Response",
    ParentType,
    ContextType
  >;
}>;

export type ResetPasswordValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["ResetPasswordValidationError"] = ResolversParentTypes["ResetPasswordValidationError"]
> = ResolversObject<{
  confirmPasswordError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  passwordError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  tokenError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ResponseResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["Response"] = ResolversParentTypes["Response"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ServerErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["ServerError"] = ResolversParentTypes["ServerError"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SessionIdValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["SessionIdValidationError"] = ResolversParentTypes["SessionIdValidationError"]
> = ResolversObject<{
  sessionIdError?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SinglePostResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["SinglePost"] = ResolversParentTypes["SinglePost"]
> = ResolversObject<{
  post?: Resolver<ResolversTypes["Post"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnknownErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["UnknownError"] = ResolversParentTypes["UnknownError"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnpublishUndoUnpublishPostResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["UnpublishUndoUnpublishPost"] = ResolversParentTypes["UnpublishUndoUnpublishPost"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthenticationError"
    | "NotAllowedError"
    | "NotAllowedPostActionError"
    | "PostIdValidationError"
    | "RegistrationError"
    | "Response"
    | "SinglePost"
    | "UnknownError",
    ParentType,
    ContextType
  >;
}>;

export type UserResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = ResolversObject<{
  dateCreated?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  firstName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  isRegistered?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserDataResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["UserData"] = ResolversParentTypes["UserData"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "EditedProfile" | "LoggedInUser" | "RegisteredUser" | "VerifiedSession",
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
}>;

export type UserSessionErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["UserSessionError"] = ResolversParentTypes["UserSessionError"]
> = ResolversObject<{
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VerifiedResetTokenResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["VerifiedResetToken"] = ResolversParentTypes["VerifiedResetToken"]
> = ResolversObject<{
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  resetToken?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VerifiedSessionResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["VerifiedSession"] = ResolversParentTypes["VerifiedSession"]
> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VerifyResetTokenResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["VerifyResetToken"] = ResolversParentTypes["VerifyResetToken"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "NotAllowedError"
    | "RegistrationError"
    | "VerifiedResetToken"
    | "VerifyResetTokenValidationError",
    ParentType,
    ContextType
  >;
}>;

export type VerifyResetTokenValidationErrorResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["VerifyResetTokenValidationError"] = ResolversParentTypes["VerifyResetTokenValidationError"]
> = ResolversObject<{
  status?: Resolver<ResolversTypes["Status"], ParentType, ContextType>;
  tokenError?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VerifySessionResolvers<
  ContextType = APIContext,
  ParentType extends ResolversParentTypes["VerifySession"] = ResolversParentTypes["VerifySession"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | "AuthCookieError"
    | "ForbiddenError"
    | "NotAllowedError"
    | "SessionIdValidationError"
    | "UnknownError"
    | "VerifiedSession",
    ParentType,
    ContextType
  >;
}>;

export type Resolvers<ContextType = APIContext> = ResolversObject<{
  AccessToken?: AccessTokenResolvers<ContextType>;
  AuthCookieError?: AuthCookieErrorResolvers<ContextType>;
  AuthenticationError?: AuthenticationErrorResolvers<ContextType>;
  BaseResponse?: BaseResponseResolvers<ContextType>;
  BinPost?: BinPostResolvers<ContextType>;
  BinPosts?: BinPostsResolvers<ContextType>;
  ChangePassword?: ChangePasswordResolvers<ContextType>;
  ChangePasswordValidationError?: ChangePasswordValidationErrorResolvers<ContextType>;
  CreateDraftPost?: CreateDraftPostResolvers<ContextType>;
  CreatePostTags?: CreatePostTagsResolvers<ContextType>;
  CreatePostTagsValidationError?: CreatePostTagsValidationErrorResolvers<ContextType>;
  CreateUser?: CreateUserResolvers<ContextType>;
  CreatedPostTagsWarning?: CreatedPostTagsWarningResolvers<ContextType>;
  DeletePostContentImages?: DeletePostContentImagesResolvers<ContextType>;
  DeletePostContentImagesValidationError?: DeletePostContentImagesValidationErrorResolvers<ContextType>;
  DeletePostTags?: DeletePostTagsResolvers<ContextType>;
  DeletePostTagsValidationError?: DeletePostTagsValidationErrorResolvers<ContextType>;
  DeletedPostTags?: DeletedPostTagsResolvers<ContextType>;
  DeletedPostTagsWarning?: DeletedPostTagsWarningResolvers<ContextType>;
  DuplicatePostTagError?: DuplicatePostTagErrorResolvers<ContextType>;
  DuplicatePostTitleError?: DuplicatePostTitleErrorResolvers<ContextType>;
  EditPost?: EditPostResolvers<ContextType>;
  EditPostTag?: EditPostTagResolvers<ContextType>;
  EditPostTagValidationError?: EditPostTagValidationErrorResolvers<ContextType>;
  EditPostValidationError?: EditPostValidationErrorResolvers<ContextType>;
  EditProfile?: EditProfileResolvers<ContextType>;
  EditProfileValidationError?: EditProfileValidationErrorResolvers<ContextType>;
  EditedPostTag?: EditedPostTagResolvers<ContextType>;
  EditedPostTagWarning?: EditedPostTagWarningResolvers<ContextType>;
  EditedProfile?: EditedProfileResolvers<ContextType>;
  EmailValidationError?: EmailValidationErrorResolvers<ContextType>;
  EmptyBinWarning?: EmptyBinWarningResolvers<ContextType>;
  ForbiddenError?: ForbiddenErrorResolvers<ContextType>;
  ForgotGeneratePassword?: ForgotGeneratePasswordResolvers<ContextType>;
  GetPost?: GetPostResolvers<ContextType>;
  GetPostTags?: GetPostTagsResolvers<ContextType>;
  GetPostValidationError?: GetPostValidationErrorResolvers<ContextType>;
  GetPosts?: GetPostsResolvers<ContextType>;
  GetPostsData?: GetPostsDataResolvers<ContextType>;
  GetPostsPageData?: GetPostsPageDataResolvers<ContextType>;
  GetPostsValidationError?: GetPostsValidationErrorResolvers<ContextType>;
  LoggedInUser?: LoggedInUserResolvers<ContextType>;
  Login?: LoginResolvers<ContextType>;
  LoginValidationError?: LoginValidationErrorResolvers<ContextType>;
  Logout?: LogoutResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NotAllowedError?: NotAllowedErrorResolvers<ContextType>;
  NotAllowedPostActionError?: NotAllowedPostActionErrorResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostAuthor?: PostAuthorResolvers<ContextType>;
  PostContent?: PostContentResolvers<ContextType>;
  PostIdValidationError?: PostIdValidationErrorResolvers<ContextType>;
  PostIdsValidationError?: PostIdsValidationErrorResolvers<ContextType>;
  PostTableOfContents?: PostTableOfContentsResolvers<ContextType>;
  PostTag?: PostTagResolvers<ContextType>;
  PostTags?: PostTagsResolvers<ContextType>;
  PostUrl?: PostUrlResolvers<ContextType>;
  PostValidationError?: PostValidationErrorResolvers<ContextType>;
  Posts?: PostsResolvers<ContextType>;
  PostsWarning?: PostsWarningResolvers<ContextType>;
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
  UnknownError?: UnknownErrorResolvers<ContextType>;
  UnpublishUndoUnpublishPost?: UnpublishUndoUnpublishPostResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserData?: UserDataResolvers<ContextType>;
  UserSessionError?: UserSessionErrorResolvers<ContextType>;
  VerifiedResetToken?: VerifiedResetTokenResolvers<ContextType>;
  VerifiedSession?: VerifiedSessionResolvers<ContextType>;
  VerifyResetToken?: VerifyResetTokenResolvers<ContextType>;
  VerifyResetTokenValidationError?: VerifyResetTokenValidationErrorResolvers<ContextType>;
  VerifySession?: VerifySessionResolvers<ContextType>;
}>;
