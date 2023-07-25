import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { FORGOT_PASSWORD } from "../operations/FORGOT_PASSWORD";

interface Expected {
  message: string;
  gql: MockedResponse[];
}

export const EMAIL = "forgot_password@example.org";
const request: MockedResponse["request"] = {
  query: FORGOT_PASSWORD,
  variables: { email: EMAIL },
};

class Mocks {
  constructor(readonly typename: string, readonly message: string) {}

  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            forgotPassword: {
              __typename: this.typename,
              message: this.message,
              status: "ERROR",
            },
          },
        },
      },
    ];
  }
}

const notAllowed = new Mocks(
  "NotAllowedError",
  "Unknown email address provided"
);

const server = new Mocks(
  "ServerError",
  "Unable to send password reset link at this time"
);

export const registration = new Mocks(
  "RegistrationError",
  "Cant rest password for unregistered account"
);

export const unsupported = new Mocks(
  "UnsupportedObjectType",
  "You are unable to reset your password at the moment. Please try again later"
);

export const validation = {
  emailError: "Invalid e-mail address server response",
  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            forgotPassword: {
              __typename: "EmailValidationError",
              emailError: this.emailError,
              status: "ERROR",
            },
          },
        },
      },
    ];
  },
};

const graphql = {
  message: "Server responded with a graphql error",
  gql(): MockedResponse[] {
    return [{ request, result: { errors: [new GraphQLError(this.message)] } }];
  },
};

const network = {
  message:
    "You are unable to reset your password at the moment. Please try again later",
  gql(): MockedResponse[] {
    return [{ request, error: new Error(this.message) }];
  },
};

export const success = {
  message: "Password request link has been sent to the email address provided",
  gql(): MockedResponse[] {
    return [
      {
        request,
        result: {
          data: {
            forgotPassword: {
              __typename: "Response",
              message: this.message,
              status: "SUCCESS",
            },
          },
        },
      },
    ];
  },
};

export const testTable: [string, Expected][] = [
  [
    "email does not match a valid account on the server",
    { message: notAllowed.message, gql: notAllowed.gql() },
  ],
  [
    "server response is a server error object",
    { message: server.message, gql: server.gql() },
  ],
  [
    "server responds with a network error",
    { message: network.message, gql: network.gql() },
  ],
  [
    "server responds with a graphql error",
    { message: graphql.message, gql: graphql.gql() },
  ],
];

const message = "Unable to verify password reset token";

export const statusTable: [string, string, string][] = [
  [
    "an empty password reset token string is provided",
    "empty",
    "No password reset token provided",
  ],
  [
    "a malformed password reset token string is provided",
    "invalid",
    "Wrong password reset token format provided",
  ],
  [
    "a password reset token validation error occurs",
    "validation",
    "Invalid password reset token provided",
  ],
  ["the password reset token is unknown or has expired", "fail", message],
  [
    "password reset token verification response is an unsupported object",
    "unsupported",
    message,
  ],
  [
    "a graphql error occurs while verifying the password reset token ",
    "api",
    message,
  ],
  [
    "a network error prevents the password reset token verification",
    "network",
    `${message}. Please try again later`,
  ],
];
