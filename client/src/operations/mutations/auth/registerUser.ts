import { gql, type TypedDocumentNode } from "@apollo/client";

import { USER_FIELDS } from "@fragments/session/user";
import type { RegisterUserMutationVariables as Vars } from "@appTypes/graphql";
import type { RegisterUserData } from "@appTypes/auth/registerUser";

type RegisterUser = TypedDocumentNode<RegisterUserData, Vars>;

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
