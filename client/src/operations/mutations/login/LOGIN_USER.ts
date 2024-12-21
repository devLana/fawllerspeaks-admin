import { gql, type TypedDocumentNode } from "@apollo/client";

import { USER_FIELDS } from "@fragments/USER";
import type { MutationLoginArgs } from "@apiTypes";
import type { LoginData } from "types/auth/login";

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
