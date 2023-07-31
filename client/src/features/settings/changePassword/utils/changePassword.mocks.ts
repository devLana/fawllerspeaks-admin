import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { CHANGE_PASSWORD } from "../operations/CHANGE_PASSWORD";

export const CURRENT_PASSWORD = "current_password";
export const PASSWORD = "Pass!W0rd";
const notAllowedMsg =
  "Unable to change password. 'current password' does not match your account";

const msg =
  "You are unable to change your password at the moment. Please try again later";

const request: MockedResponse["request"] = {
  query: CHANGE_PASSWORD,
  variables: {
    currentPassword: CURRENT_PASSWORD,
    newPassword: PASSWORD,
    confirmNewPassword: PASSWORD,
  },
};

class Mock {
  constructor(
    readonly message: string,
    readonly typename: string,
    readonly status = "ERROR"
  ) {}

  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            changePassword: {
              __typename: this.typename,
              message: this.message,
              status: this.status,
            },
          },
        },
      },
    ];
  }
}

const auth = new Mock("User not logged in", "AuthenticationError");
const unknown = new Mock("User does not exist", "UnknownError");
const register = new Mock("User is not registered", "RegistrationError");
const notAllowed = new Mock(notAllowedMsg, "NotAllowedError");
const server = new Mock("Unable to change password", "ServerError");
const unsupported = new Mock(msg, "UnsupportedType", "SUCCESS");
const response = new Mock("Password changed", "Response", "SUCCESS");

export const validation = {
  currentPasswordError: "Provide current password",
  newPasswordError: "Password must be at least 8 characters long",
  confirmNewPasswordError: "Passwords do not match",
  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            changePassword: {
              __typename: "ChangePasswordValidationError",
              currentPasswordError: this.currentPasswordError,
              newPasswordError: this.newPasswordError,
              confirmNewPasswordError: this.confirmNewPasswordError,
              status: "ERROR",
            },
          },
        },
      },
    ];
  },
};

const network = {
  message: msg,
  gql(): MockedResponse[] {
    return [{ request, error: new Error(this.message) }];
  },
};

const graphql = {
  message: "Something went wrong. Please try again later",
  gql(): MockedResponse[] {
    return [{ request, result: { errors: [new GraphQLError(this.message)] } }];
  },
};

export const redirectTable: [string, string[], MockedResponse[]][] = [
  [
    "Redirect to the login page if the user is not logged in",
    ["/login", "unauthenticated"],
    auth.gql(),
  ],
  [
    "Redirect to register page if the user is unregistered",
    ["/register", "unregistered"],
    register.gql(),
  ],
  [
    "Redirect to the login page if the user could not be verified",
    ["/login", "unauthorized"],
    unknown.gql(),
  ],
];

export const alertTable: [string, string, MockedResponse[]][] = [
  [
    "If the provided password does not match the account password",
    notAllowed.message,
    notAllowed.gql(),
  ],
  ["If the user's password could not be changed", server.message, server.gql()],
  [
    "If the request throws a graphql error response",
    graphql.message,
    graphql.gql(),
  ],
  [
    "If the request resolves with a network error",
    network.message,
    network.gql(),
  ],
  [
    "If the server responds with an unsupported object type",
    unsupported.message,
    unsupported.gql(),
  ],
  [
    "If the change password request is successful",
    response.message,
    response.gql(),
  ],
];
