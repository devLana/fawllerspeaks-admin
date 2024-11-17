import { authTypeDefs } from "@features/auth/typeDefs";
import { settingsTypeDefs } from "@features/settings/typeDefs";
import { postTagsTypeDefs } from "@features/postTags/typeDefs";
import { postsTypeDefs } from "@features/posts/typeDefs";

const types = `#graphql
  type Query {
    ####POST TAGS####
    "Get all post tags"
    getPostTags: GetPostTags!

    ####POSTS####
    "Get posts"
    getPosts(page: GetPostsPageInput, filters: GetPostsFiltersInput): GetPosts!
    "Get post by slug"
    getPost(slug: String!): GetPost!
  }

  type Mutation {
    ####AUTHENTICATION####
    "Create a new user"
    createUser(email: String!): CreateUser!
    "Verify user email and initiate reset password"
    forgotPassword(email: String!): ForgotGeneratePassword!
    "Login a user"
    login(email: String!, password: String!): Login!
    "Logout a user"
    logout(sessionId: String!): Logout!
    "Refresh jwt access token"
    refreshToken(sessionId: String!): RefreshToken!
    "Register newly created user"
    registerUser(userInput: RegisterUserInput!): RegisterUser!
    "Reset password for registered user"
    resetPassword(token: String!, password: String!, confirmPassword: String!): ResetPassword!
    "Generate new password for unregistered user"
    generatePassword(email: String!): ForgotGeneratePassword!
    "Verify password reset token"
    verifyResetToken(token: String!): VerifyResetToken!
    "Verify user session"
    verifySession(sessionId: String!): VerifySession!

    ####SETTINGS####
    "Change password of registered and signed in user"
    changePassword(currentPassword: String!, newPassword: String!, confirmNewPassword: String!): ChangePassword!
    "Edit user profile"
    editProfile(firstName: String!, lastName: String!, image: String): EditProfile!

    ####POST TAGS####
    "Create a new post tag or multiple tags"
    createPostTags(tags: [String!]!): CreatePostTags!
    "Edit a post tag"
    editPostTag(tagId: ID!, name: String!): EditPostTag!
    "Delete a post tag or multiple post tags"
    deletePostTags(tagIds: [ID!]!): DeletePostTags!

    ####POSTS####
    "Create a new post"
    createPost(post: CreatePostInput!): CreateDraftPost!
    "Draft a post"
    draftPost(post: DraftPostInput!): CreateDraftPost!
    "Edit a created/published post"
    editPost(post: EditPostInput!): EditPost!
    "Publish a post"
    publishPost(postId: ID!): Publish_Unpublish!
    "Un-publish a post"
    unpublishPost(postId: ID!): Publish_Unpublish!
    "Move posts to bin"
    binPosts(postIds: [ID!]!): Bin_UnBin_Delete!
    "Un-bin posts from bin"
    unBinPosts(postIds: [ID!]!): Bin_UnBin_Delete!
    "Delete posts from bin"
    deletePostsFromBin(postIds: [ID!]!): Bin_UnBin_Delete!
    "Empty bin(Delete all posts from bin)"
    emptyBin: EmptyBin!
    "Delete post content images from storage bucket"
    deletePostContentImages(images: [String!]!): DeletePostContentImages!
  }

  enum Status {
    SUCCESS
    ERROR
    WARN
  }

  interface BaseResponse {
    message: String!
    status: Status!
  }

  interface UserData {
    user: User!
    status: Status!
  }

  type NotAllowedError implements BaseResponse {
    message: String!
    status: Status!
  }

  type UnknownError implements BaseResponse {
    message: String!
    status: Status!
  }

  type ServerError implements BaseResponse {
    message: String!
    status: Status!
  }

  type RegistrationError implements BaseResponse {
    message: String!
    status: Status!
  }

  type AuthenticationError implements BaseResponse {
    message: String!
    status: Status!
  }

  type UserSessionError implements BaseResponse {
    message: String!
    status: Status!
  }

  type ForbiddenError implements BaseResponse {
    message: String!
    status: Status!
  }

  type AuthCookieError implements BaseResponse {
    message: String!
    status: Status!
  }

  type Response implements BaseResponse {
    message: String!
    status: Status!
  }

  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
    image: String
    isRegistered: Boolean!
    dateCreated: String!
  }
`;

export const typeDefs = [
  types,
  authTypeDefs,
  settingsTypeDefs,
  postTagsTypeDefs,
  postsTypeDefs,
];

export default typeDefs.join("");
