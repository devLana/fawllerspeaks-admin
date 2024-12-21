import { gql, type TypedDocumentNode as DocNode } from "@apollo/client";
import type { ForgotPasswordData } from "types/auth/forgotPassword";
import type { MutationForgotPasswordArgs } from "@apiTypes";

type ForgotPassword = DocNode<ForgotPasswordData, MutationForgotPasswordArgs>;

export const FORGOT_PASSWORD: ForgotPassword = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      ... on EmailValidationError {
        emailError
      }
      ... on BaseResponse {
        __typename
      }
      ... on NotAllowedError {
        message
      }
      ... on ServerError {
        message
      }
    }
  }
`;
