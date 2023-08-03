import { gql, type TypedDocumentNode as Node } from "@apollo/client";
import type { Mutation, MutationRegisterUserArgs } from "@apiTypes";

type RegisterUserData = Pick<Mutation, "registerUser">;
type RegisterUser = Node<RegisterUserData, MutationRegisterUserArgs>;

export const REGISTER_USER: RegisterUser = gql`
  mutation RegisterUser($userInput: RegisterUserInput!) {
    registerUser(userInput: $userInput) {
      ... on RegisterUserValidationError {
        firstNameError
        lastNameError
        passwordError
        confirmPasswordError
        status
      }

      ... on BaseResponse {
        message
        status
      }

      ... on RegisteredUser {
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
