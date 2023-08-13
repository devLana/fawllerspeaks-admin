export const settingsTypeDefs = `#graphql
  type EditedProfile implements UserData {
    user: User!
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
    imageError: String
    status: Status!
  }

  union ChangePassword = Response | ChangePasswordValidationError | AuthenticationError | NotAllowedError | RegistrationError | UnknownError | ServerError

  union EditProfile = EditedProfile | EditProfileValidationError | AuthenticationError | UnknownError | RegistrationError
`;
