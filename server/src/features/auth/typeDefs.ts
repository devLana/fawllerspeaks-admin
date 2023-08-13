export const authTypeDefs = `#graphql
  type LoggedInUser implements UserData {
    accessToken: String!
    sessionId: ID!
    user: User!
    status: Status!
  }

  type AccessToken {
    accessToken: String!
    status: Status!
  }

  type VerifiedResetToken {
    email: String!
    resetToken: String!
    status: Status!
  }

  type RegisteredUser implements UserData {
    user: User!
    status: Status!
  }

  type VerifiedSession implements UserData {
    accessToken: String!
    user: User!
    status: Status!
  }

  type EmailValidationError {
    emailError: String!
    status: Status!
  }

  type LoginValidationError {
    emailError: String
    passwordError: String
    status: Status!
  }

  type ResetPasswordValidationError {
    tokenError: String
    passwordError: String
    confirmPasswordError:String
    status: Status!
  }

  type SessionIdValidationError {
    sessionIdError: String!
    status: Status!
  }

  type RegisterUserValidationError {
    firstNameError: String
    lastNameError: String
    passwordError: String
    confirmPasswordError: String
    status: Status!
  }

  type VerifyResetTokenValidationError {
    tokenError: String!
    status: Status!
  }

  union CreateUser = Response | EmailValidationError | NotAllowedError | ServerError

  union ForgotGeneratePassword = Response | EmailValidationError | NotAllowedError | RegistrationError | ServerError

  union Login = LoggedInUser | LoginValidationError | NotAllowedError

  union Logout = Response | SessionIdValidationError | AuthenticationError | NotAllowedError | UnknownError

  union RefreshToken = AccessToken | SessionIdValidationError | AuthenticationError | UserSessionError | NotAllowedError | UnknownError

  union RegisterUser = RegisteredUser | RegisterUserValidationError | AuthenticationError | UnknownError | RegistrationError

  union ResetPassword = Response | ResetPasswordValidationError | NotAllowedError | RegistrationError

  union VerifyResetToken = VerifiedResetToken | VerifyResetTokenValidationError | NotAllowedError | RegistrationError

  union VerifySession = VerifiedSession | SessionIdValidationError | UserSessionError | NotAllowedError | UnknownError

  input RegisterUserInput {
    firstName: String!
    lastName: String!
    password: String!
    confirmPassword: String!
  }
`;
