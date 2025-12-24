import { authTypeDefs } from "./auth";
import { settingsTypeDefs } from "./settings";
import { postTagsTypeDefs } from "./postTags";
import { postsTypeDefs } from "./posts";

const types = `#graphql
  type Query {
    ####POST TAGS####
    "Get all post tags"
    getPostTags: GetPostTags!

    ####POSTS####
    "Get posts"
    getPosts(after: ID, size: Int, sort: SortPostsBy, status: PostStatus): GetPosts!
    "Get post by slug"
    getPost(slug: String!): GetPost!
  }

  type Mutation {
    ####AUTHENTICATION####
    "Create a new user"
    createUser(email: String!): CreateUser_GeneratePassword!
    "Generate new password for unregistered user"
    generatePassword(email: String!): CreateUser_GeneratePassword!
    "Login a user"
    login(email: String!, password: String!): Login!
    "Logout a user"
    logout: Response!
    "Verify user session"
    verifySession: VerifySession!
    "Refresh jwt access token"
    refreshToken: RefreshToken!
    "Register newly created user"
    registerUser(userInput: RegisterUserInput!): RegisterUser!
    "Verify user email and initiate password reset"
    forgotPassword(email: String!): ForgotPassword!
    "Verify password reset token"
    verifyResetToken(token: String!): VerifyResetToken!
    "Reset password for registered user"
    resetPassword(token: String!, password: String!, confirmPassword: String!): ResetPassword!

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
    createPost(post: CreatePostInput!): Create_Draft!
    "Draft a post"
    draftPost(post: DraftPostInput!): Create_Draft!
    "Edit a post"
    editPost(post: EditPostInput!): EditPost!
    "Unpublish a post"
    unpublishPost(postId: ID!): Unpublish_Undo!
    "Undo Unpublish post"
    undoUnpublishPost(postId: ID!): Unpublish_Undo!
    "Move a post to bin"
    binPost(postId: ID!): BinPost!
    "Move posts to bin"
    binPosts(postIds: [ID!]!): BinPosts!
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

  type ForbiddenError implements BaseResponse {
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
  postsTypeDefs,
  postTagsTypeDefs,
  settingsTypeDefs,
];

export default typeDefs.join("");
