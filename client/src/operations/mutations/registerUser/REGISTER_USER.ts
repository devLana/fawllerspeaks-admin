import { gql, type TypedDocumentNode as Node } from "@apollo/client";

import { USER_FIELDS } from "@fragments/USER";
import type { MutationRegisterUserArgs } from "@apiTypes";
import type { RegisterUserData } from "types/auth/registerUser";

type RegisterUser = Node<RegisterUserData, MutationRegisterUserArgs>;

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
