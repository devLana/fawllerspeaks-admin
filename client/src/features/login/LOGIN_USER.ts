import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Mutation, MutationLoginArgs } from "@apiTypes";

type LoginData = Pick<Mutation, "login">;
type Login = TypedDocumentNode<LoginData, MutationLoginArgs>;

export const LOGIN_USER: Login = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ... on NotAllowedError {
        message
        status
      }

      ... on LoginValidationError {
        emailError
        passwordError
        status
      }

      ... on UserData {
        user {
          email
          id
          firstName
          lastName
          image
          isRegistered
          dateCreated
          accessToken
          sessionId
        }
        status
      }
    }
  }
`;
