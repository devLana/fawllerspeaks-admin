import { gql, type TypedDocumentNode } from "@apollo/client";

import { USER_FIELDS } from "@fragments/session/user";
import type { LoginMutationVariables } from "@appTypes/graphql";
import type { LoginData } from "@appTypes/auth/login";

type Login = TypedDocumentNode<LoginData, LoginMutationVariables>;

export const LOGIN: Login = gql`
  ${USER_FIELDS}
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ... on LoginValidationError {
        emailError
        passwordError
      }
      ... on ForbiddenError {
        message
      }
      ... on SessionData {
        accessToken
        user {
          ...UserFields
        }
      }
    }
  }
`;
