export const settingsTypeDefs = `#graphql
  type EditedProfile {
    id: ID!
    firstName: String!
    lastName: String!
    status: Status!
  }

  type ChangePasswordValidationError {
    currentPasswordError: String
    newPasswordError: String
    confirmNewPasswordError: String
    status: Status!
  }

  type EditProfileValidationError {
    firstNameError: String
    lastNameError: String
    status: Status!
  }

  union ChangePassword = Response | ChangePasswordValidationError | NotAllowedError | RegistrationError | UnknownError | ServerError

  union EditProfile = EditedProfile | EditProfileValidationError | NotAllowedError | RegistrationError
`;
