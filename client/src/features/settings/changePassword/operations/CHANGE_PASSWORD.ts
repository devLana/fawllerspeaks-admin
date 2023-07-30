import { gql, type TypedDocumentNode as Node } from "@apollo/client";
import type { Mutation, MutationChangePasswordArgs } from "@apiTypes";

type ChangePasswordData = Pick<Mutation, "changePassword">;
type ChangePassword = Node<ChangePasswordData, MutationChangePasswordArgs>;

export const CHANGE_PASSWORD: ChangePassword = gql`
  mutation ChangePassword(
    $currentPassword: String!
    $newPassword: String!
    $confirmNewPassword: String!
  ) {
    changePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
      confirmNewPassword: $confirmNewPassword
    ) {
      ... on ChangePasswordValidationError {
        currentPasswordError
        newPasswordError
        confirmNewPasswordError
        status
      }

      ... on AuthenticationError {
        message
        status
      }

      ... on NotAllowedError {
        message
        status
      }

      ... on RegistrationError {
        message
        status
      }

      ... on ServerError {
        message
        status
      }

      ... on UnknownError {
        message
        status
      }

      ... on Response {
        message
        status
      }
    }
  }
`;
