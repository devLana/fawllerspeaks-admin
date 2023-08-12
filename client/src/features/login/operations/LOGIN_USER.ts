import { gql, type TypedDocumentNode } from "@apollo/client";

import { USER_FIELDS } from "@fragments/User";
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
        status
      }

      ... on BaseResponse {
        message
        status
      }

      ... on LoggedInUser {
        accessToken
        sessionId
        user {
          ...UserFields
        }
        status
      }
    }
  }
`;
