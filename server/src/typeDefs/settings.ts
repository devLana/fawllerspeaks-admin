export const settingsTypeDefs = `#graphql
  type EditedProfile {
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

  union ChangePassword = Response | ChangePasswordValidationError | UnauthorizedError | ForbiddenError | RegistrationError

  union EditProfile = EditedProfile | EditProfileValidationError | UnauthorizedError | RegistrationError
`;
