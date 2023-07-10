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

      ... on NotAllowedError {
        message
        status
      }

      ... on RegistrationError {
        message
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
