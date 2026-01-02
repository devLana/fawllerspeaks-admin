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

  union CreateUser_GeneratePassword = Response | EmailValidationError | ForbiddenError | ServerError

  union Login = SessionData | LoginValidationError | ForbiddenError
  
  union VerifySession = SessionData | UnauthorizedError | ForbiddenError
  
  union RefreshToken = RefreshData | UnauthorizedError | ForbiddenError
  
  union RegisterUser = RegisteredUser | RegisterUserValidationError | UnauthorizedError | RegistrationError
  
  union ForgotPassword = Response | EmailValidationError | ForbiddenError | ServerError

  union VerifyResetToken = VerifiedResetToken | VerifyResetTokenValidationError | ForbiddenError
  
  union ResetPassword = Response | ResetPasswordValidationError | ForbiddenError

  input RegisterUserInput {
    firstName: String!
    lastName: String!
    password: String!
    confirmPassword: String!
  }
`;
