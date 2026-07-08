import { gql, type TypedDocumentNode as Node } from "@apollo/client";
import type { MutationChangePasswordArgs } from "@appTypes/graphql";
import type { ChangePasswordData } from "@appTypes/settings/changePassword";

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
      }
      ... on BaseResponse {
        __typename
      }
      ... on Response {
        message
      }
    }
  }
`;
