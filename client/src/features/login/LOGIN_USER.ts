import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Mutation, MutationLoginArgs } from "@apiTypes";

type LoginData = Pick<Mutation, "login">;
type Login = TypedDocumentNode<LoginData, MutationLoginArgs>;

export const LOGIN_USER: Login = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ... on LoginValidationError {
        emailError
        passwordError
        status
      }

      ... on NotAllowedError {
        message
        status
      }

      ... on LoggedInUser {
        accessToken
        sessionId
        user {
          id
          email
          firstName
          lastName
          image
          isRegistered
          dateCreated
        }
        status
      }
    }
  }
`;
