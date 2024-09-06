import { gql, type TypedDocumentNode } from "@apollo/client";

import { USER_FIELDS } from "@features/auth/fragments/User";
import type { Mutation, MutationLoginArgs } from "@apiTypes";

type LoginData = Pick<Mutation, "login">;
type Login = TypedDocumentNode<LoginData, MutationLoginArgs>;

export const LOGIN_USER: Login = gql`
  ${USER_FIELDS}
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ... on LoginValidationError {
        emailError
        passwordError
      }
      ... on BaseResponse {
        message
      }
      ... on NotAllowedError {
        message
      }
      ... on LoggedInUser {
        accessToken
        sessionId
        user {
          ...UserFields
        }
      }
    }
  }
`;
