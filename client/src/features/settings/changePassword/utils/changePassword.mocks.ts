import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { CHANGE_PASSWORD } from "../operations/CHANGE_PASSWORD";

interface Data {
  message: string;
  typename: string;
  status?: "ERROR" | "SUCCESS" | "WARN";
}

interface RedirectTable {
  gql: () => MockedResponse[];
  currentPassword: string;
  password: string;
}

interface AlertTable extends RedirectTable {
  message: string;
}

const CURRENT_PASSWORD = "current_password";
const PASSWORD = "Pass!W0rd";
const notAllowedMsg =
  "Unable to change password. 'current password' does not match your account";
const msg =
  "You are unable to change your password at the moment. Please try again later";

const request = (
  currentPassword: string,
  password: string
): MockedResponse["request"] => {
  return {
    query: CHANGE_PASSWORD,
    variables: {
      currentPassword,
      newPassword: password,
      confirmNewPassword: password,
    },
  };
};

class Mock {
  currentPassword: string;
  password: string;
  message: string;
  typename: string;
  status: "ERROR" | "SUCCESS" | "WARN";

  constructor(name: string, data: Data) {
    this.currentPassword = `${name}_${CURRENT_PASSWORD}`;
    this.password = `${name}_${PASSWORD}`;
    this.message = data.message;
    this.typename = data.typename;
    this.status = data.status ?? "ERROR";
  }

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.currentPassword, this.password),
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

const auth = new Mock("auth", {
  message: "User not logged in",
  typename: "AuthenticationError",
});

const unknown = new Mock("unknown", {
  message: "User does not exist",
  typename: "UnknownError",
});

const register = new Mock("register", {
  message: "User is not registered",
  typename: "RegistrationError",
});

const notAllowed = new Mock("notAllowed", {
  message: notAllowedMsg,
  typename: "NotAllowedError",
});

const server = new Mock("server", {
  message: "Unable to change password",
  typename: "ServerError",
});

const unsupported = new Mock("unsupported", {
  message: msg,
  typename: "UnsupportedType",
  status: "SUCCESS",
});

const response = new Mock("response", {
  message: "Password changed",
  typename: "Response",
  status: "SUCCESS",
});

export const validation = {
  currentPassword: `validation_${CURRENT_PASSWORD}`,
  password: `validation_${PASSWORD}`,
  currentPasswordError: "Provide current password",
  newPasswordError: "Password must be at least 8 characters long",
  confirmNewPasswordError: "Passwords do not match",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.currentPassword, this.password),
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
  currentPassword: `network_${CURRENT_PASSWORD}`,
  password: `network_${PASSWORD}`,
  message: msg,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.currentPassword, this.password),
        error: new Error(this.message),
      },
    ];
  },
};

const graphql = {
  currentPassword: `graphql_${CURRENT_PASSWORD}`,
  password: `graphql_${PASSWORD}`,
  message: "Something went wrong. Please try again later",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.currentPassword, this.password),
        result: { errors: [new GraphQLError(this.message)] },
      },
    ];
  },
};

export const redirectTable: [string, string[], RedirectTable][] = [
  [
    "Redirect to the login page if the user is not logged in",
    ["/login", "unauthenticated"],
    auth,
  ],
  [
    "Redirect to register page if the user is unregistered",
    ["/register", "unregistered"],
    register,
  ],
  [
    "Redirect to the login page if the user could not be verified",
    ["/login", "unauthorized"],
    unknown,
  ],
];

export const alertTable: [string, AlertTable][] = [
  ["If the provided password does not match the account password", notAllowed],
  ["If the user's password could not be changed", server],
  ["If the request throws a graphql error response", graphql],
  ["If the request resolves with a network error", network],
  ["If the server responds with an unsupported object type", unsupported],
  ["If the change password request is successful", response],
];