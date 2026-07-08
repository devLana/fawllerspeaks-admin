import { gql, type TypedDocumentNode as DocNode } from "@apollo/client";
import type {
  ForgotPasswordMutation as Data,
  ForgotPasswordMutationVariables as Vars,
} from "@appTypes/graphql";

type ForgotPassword = DocNode<Data, Vars>;

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
