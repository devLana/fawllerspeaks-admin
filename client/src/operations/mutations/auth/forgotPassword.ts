import { gql, type TypedDocumentNode } from "@apollo/client";

import type { TypeMapper } from "@appTypes";
import type {
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables as Vars,
} from "@appTypes/graphql";

type ForgotPasswordData = TypeMapper<ForgotPasswordMutation>;
type ForgotPassword = TypedDocumentNode<ForgotPasswordData, Vars>;

export const FORGOT_PASSWORD: ForgotPassword = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      ... on EmailValidationError {
        emailError
      }
      ... on ForbiddenError {
        message
      }
      ... on ServerError {
        message
      }
      ... on Response {
        __typename
      }
    }
  }
`;
