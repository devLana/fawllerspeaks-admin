export const authTypeDefs = `#graphql
  type SessionData {
    accessToken: String!
    user: User!
    status: Status!
  }

  type RefreshData {
    accessToken: String!
    status: Status!
  }

  type VerifiedResetToken {
    email: String!
    resetToken: String!
    status: Status!
  }

  type RegisteredUser {
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

  union CreateUser_GeneratePassword = Response | EmailValidationError | NotAllowedError | ServerError

  union Login = SessionData | LoginValidationError | UnknownError | NotAllowedError
  
  union VerifySession = SessionData | AuthenticationError | NotAllowedError
  
  union RefreshToken = RefreshData | AuthenticationError | NotAllowedError
  
  union RegisterUser = RegisteredUser | RegisterUserValidationError | AuthenticationError | RegistrationError
  
  union ForgotPassword = Response | EmailValidationError | NotAllowedError | RegistrationError | ServerError

  union VerifyResetToken = VerifiedResetToken | VerifyResetTokenValidationError | UnknownError | NotAllowedError | RegistrationError
  
  union ResetPassword = Response | ResetPasswordValidationError | NotAllowedError | UnknownError | RegistrationError

  input RegisterUserInput {
    firstName: String!
    lastName: String!
    password: String!
    confirmPassword: String!
  }
`;
