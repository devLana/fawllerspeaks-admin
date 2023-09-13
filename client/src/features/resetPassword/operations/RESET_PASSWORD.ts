import { gql, type TypedDocumentNode as Node } from "@apollo/client";
import type { Mutation, MutationResetPasswordArgs } from "@apiTypes";

type ResetPasswordData = Pick<Mutation, "resetPassword">;
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
        status
      }
    }
  }
`;
