import { gql, type TypedDocumentNode as Node } from "@apollo/client";

import { USER_FIELDS } from "@fragments/session/user";
import type {
  RegisterUserMutation,
  RegisterUserMutationVariables,
} from "@appTypes/graphql";

type RegisterUser = Node<RegisterUserMutation, RegisterUserMutationVariables>;

export const REGISTER_USER: RegisterUser = gql`
  ${USER_FIELDS}
  mutation RegisterUser($userInput: RegisterUserInput!) {
    registerUser(userInput: $userInput) {
      ... on RegisterUserValidationError {
        firstNameError
        lastNameError
        passwordError
        confirmPasswordError
      }
      ... on BaseResponse {
        __typename
      }
      ... on RegisteredUser {
        user {
          ...UserFields
        }
      }
    }
  }
`;
