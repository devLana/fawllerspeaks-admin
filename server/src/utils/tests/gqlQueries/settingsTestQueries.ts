export const CHANGE_PASSWORD = `#graphql
  mutation ChangePassword($currentPassword: String!, $newPassword: String!, $confirmNewPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword, confirmNewPassword: $confirmNewPassword) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on ChangePasswordValidationError {
        __typename
        currentPasswordError
        newPasswordError
        confirmNewPasswordError
        status
      }
    }
  }
`;

export const EDIT_PROFILE = `#graphql
  mutation EditProfile($firstName: String!, $lastName: String!, $image: String) {
    editProfile(firstName: $firstName, lastName: $lastName, image: $image) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on EditProfileValidationError {
        __typename
        firstNameError
        lastNameError
        imageError
        status
      }

      ... on EditedProfile {
        __typename
        user {
          __typename
          id
          email
          firstName
          lastName
          image
          isRegistered
          dateCreated
        }
        status
      }
    }
  }
`;
