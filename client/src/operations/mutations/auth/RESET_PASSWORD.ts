import { gql, type TypedDocumentNode as Node } from "@apollo/client";
import type { MutationResetPasswordArgs } from "@appTypes/graphql";
import type { ResetPasswordData } from "@appTypes/auth/resetPassword";

type ResetPassword = Node<ResetPasswordData, MutationResetPasswordArgs>;

export const RESET_PASSWORD: ResetPassword = gql`
  mutation ResetPassword(
    $token: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      token: $token
      password: $password
      confirmPassword: $confirmPassword
    ) {
      ... on ResetPasswordValidationError {
        tokenError
        passwordError
        confirmPasswordError
      }
      ... on BaseResponse {
        __typename
      }
    }
  }
`;
